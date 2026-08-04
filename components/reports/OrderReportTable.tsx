type Order = {
  id: string;
  order_date: string;
  branch: string;
  request_type: string;
  grand_total: number;
};

type Props = {
  orders: Order[];
};

export default function OrderReportTable({
  orders,
}: Props) {
  return (
    <div className="mt-8 rounded-2xl bg-white shadow">

      <div className="border-b p-6">

        <h2 className="text-2xl font-bold">
          Order Report
        </h2>

        <p className="mt-1 text-gray-500">
          Detailed list of submitted orders
        </p>

      </div>

      <table className="w-full">

        <thead className="bg-green-700 text-white">

          <tr>

            <th className="p-4 text-left">
              Date
            </th>

            <th className="p-4 text-left">
              Branch
            </th>

            <th className="p-4 text-left">
              Request Type
            </th>

            <th className="p-4 text-right">
              Total Cost
            </th>

          </tr>

        </thead>

        <tbody>

          {orders.map((order) => (

            <tr
              key={order.id}
              className="border-b hover:bg-gray-50"
            >

              <td className="p-4">
                {order.order_date}
              </td>

              <td className="p-4 font-medium">
                {order.branch}
              </td>

              <td className="p-4">
                {order.request_type}
              </td>

              <td className="p-4 text-right font-bold text-green-700">
                SAR {Number(order.grand_total).toLocaleString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}