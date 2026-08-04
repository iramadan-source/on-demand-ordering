type Props = {
  grandTotal: number;
  saveOrder: () => void;
};

export default function OrderSummary({
  grandTotal,
  saveOrder,
}: Props) {
  return (
    <div className="mt-8 flex items-center justify-between rounded-2xl bg-white p-8 shadow-lg">

      <div>

        <h2 className="text-2xl font-bold">
          Grand Total
        </h2>

        <p className="mt-2 text-4xl font-bold text-green-700">
          SAR {grandTotal.toFixed(2)}
        </p>

      </div>

      <button
        onClick={saveOrder}
        className="rounded-xl bg-green-700 px-10 py-4 text-lg font-semibold text-white transition hover:bg-green-800"
      >
        Save Order
      </button>

    </div>
  );
}