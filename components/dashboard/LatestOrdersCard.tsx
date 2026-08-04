import { useRouter } from "next/navigation";

type Order = {
  id: string;
  order_date: string;
  branch: string;
  request_type: string;
  grand_total: number;
};

type Props = {
  title: string;
  orders: Order[];
};

export default function LatestOrdersCard({
  title,
  orders,
}: Props) {
  const router = useRouter();

  return (
    <div className="mt-10 rounded-2xl bg-white shadow overflow-hidden">

      <div className="border-b p-6">

        <h2 className="text-3xl font-bold">
          {title}
        </h2>

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
              Type
            </th>

            <th className="p-4 text-right">
              Total
            </th>

          </tr>

        </thead>

        <tbody>

          {orders.length === 0 && (

            <tr>

              <td
                colSpan={4}
                className="p-8 text-center text-gray-500"
              >
                No orders found.
              </td>

            </tr>

          )}

          {orders.map((order) => (

            <tr
              key={order.id}
              onClick={() =>
                router.push(`/orders/${order.id}`)
              }
              className="cursor-pointer border-b hover:bg-green-50 transition"
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

              <td className="p-4 text-right font-bold">
                SAR {Number(order.grand_total).toLocaleString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}