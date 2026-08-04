type Item = {
  name: string;
  unit: string;
  cost: number;
};

type OrderItem = {
  item: Item;
  quantity: number;
};

type Props = {
  rows: OrderItem[];
  updateQuantity: (index: number, quantity: number) => void;
  removeRow: (index: number) => void;
};

export default function OrderTable({
  rows,
  updateQuantity,
  removeRow,
}: Props) {
  return (
    <div className="mt-8 overflow-x-auto rounded-2xl bg-white p-8 shadow-lg">

      <table className="w-full">

        <thead>

          <tr className="bg-green-700 text-white">

            <th className="p-3 text-left">
              Item
            </th>

            <th className="p-3 text-center">
              Unit
            </th>

            <th className="p-3 text-center">
              Qty
            </th>

            <th className="p-3 text-center">
              Unit Cost
            </th>

            <th className="p-3 text-center">
              Total
            </th>

            <th className="p-3 text-center">
              Remove
            </th>

          </tr>

        </thead>

        <tbody>

          {rows.length === 0 && (

            <tr>

              <td
                colSpan={6}
                className="p-10 text-center text-gray-500"
              >

                No items added yet.

                <br />

                Click <strong>+ Add Item</strong> to start.

              </td>

            </tr>

          )}

          {rows.map((row, index) => (

            <tr
              key={index}
              className="border-b hover:bg-gray-50"
            >

              <td className="p-3">

                {row.item.name}

              </td>

              <td className="text-center">

                {row.item.unit}

              </td>

              <td className="p-2 text-center">

                <input
                  type="number"
                  min={1}
                  value={row.quantity}
                  onChange={(e) => {

  const qty =
    Math.max(
      1,
      Number(e.target.value) || 1
    );

  updateQuantity(
    index,
    qty
  );

}}
                  className="w-24 rounded-lg border p-2 text-center"
                />

              </td>

              <td className="text-center">

                SAR {row.item.cost.toFixed(2)}

              </td>

              <td className="text-center font-semibold">

                SAR {(row.item.cost * row.quantity).toFixed(2)}

              </td>

              <td className="text-center">

                <button
                  onClick={() => removeRow(index)}
                  className="rounded-lg bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200"
                >
                  🗑
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}