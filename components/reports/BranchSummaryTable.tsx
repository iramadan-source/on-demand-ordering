type Order = {
  id: string;
  branch: string;
  grand_total: number;
};

type OrderItem = {
  order_id: string;
  quantity: number;
};

type Props = {
  orders: Order[];
  items: OrderItem[];
};

export default function BranchSummaryTable({
  orders,
  items,
}: Props) {

  const summary = Object.values(

    orders.reduce((acc, order) => {

      if (!acc[order.branch]) {

        acc[order.branch] = {
          branch: order.branch,
          orders: 0,
          items: 0,
          cost: 0,
        };

      }

      acc[order.branch].orders += 1;

      acc[order.branch].cost += Number(
        order.grand_total
      );

      const orderItems = items.filter(
        (item) => item.order_id === order.id
      );

      acc[order.branch].items += orderItems.reduce(
        (sum, item) => sum + Number(item.quantity),
        0
      );

      return acc;

    }, {} as Record<
      string,
      {
        branch: string;
        orders: number;
        items: number;
        cost: number;
      }
    >)

  );

  return (

    <div className="mt-8 rounded-2xl bg-white shadow">

      <div className="border-b p-6">

        <h2 className="text-2xl font-bold">
          Branch Summary
        </h2>

      </div>

      <table className="w-full">

        <thead className="bg-green-700 text-white">

          <tr>

            <th className="p-4 text-left">
              Branch
            </th>

            <th className="p-4 text-center">
              Orders
            </th>

            <th className="p-4 text-center">
              Items
            </th>

            <th className="p-4 text-right">
              Total Cost
            </th>

          </tr>

        </thead>

        <tbody>

          {summary.map((row) => (

            <tr
              key={row.branch}
              className="border-b hover:bg-gray-50"
            >

              <td className="p-4 font-medium">
                {row.branch}
              </td>

              <td className="p-4 text-center">
                {row.orders}
              </td>

              <td className="p-4 text-center">
                {row.items}
              </td>

              <td className="p-4 text-right font-bold text-green-700">
                SAR {row.cost.toLocaleString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}