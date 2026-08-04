type Props = {
  selectedDate: string;
  previousDay: () => void;
  nextDay: () => void;
  onChange: (value: string) => void;
};

export default function DateNavigator({
  selectedDate,
  previousDay,
  nextDay,
  onChange,
}: Props) {
  return (
    <div className="mb-8 flex items-center justify-between rounded-2xl bg-white p-6 shadow">

      <button
        onClick={previousDay}
        className="rounded-lg bg-gray-200 px-5 py-3 hover:bg-gray-300"
      >
        ◀ Previous
      </button>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border p-3 text-lg"
      />

      <button
        onClick={nextDay}
        className="rounded-lg bg-gray-200 px-5 py-3 hover:bg-gray-300"
      >
        Next ▶
      </button>

    </div>
  );
}