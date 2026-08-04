type Item = {
  name: string;
  unit: string;
  cost: number;
};

type Props = {
  show: boolean;
  search: string;
  setSearch: (value: string) => void;
  items: Item[];
  addItem: (item: Item) => void;
  onClose: () => void;
};

export default function ItemSearchModal({
  show,
  search,
  setSearch,
  items,
  addItem,
  onClose,
}: Props) {

  if (!show) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-[700px] rounded-2xl bg-white p-6 shadow-2xl">

        <h2 className="mb-5 text-3xl font-bold">

          Search Item

        </h2>

        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Start typing..."
          className="mb-5 w-full rounded-xl border p-4 text-lg"
        />

        <div className="max-h-[450px] overflow-y-auto rounded-xl border">

          {items.length === 0 && (

            <div className="p-6 text-center text-gray-500">

              No items found

            </div>

          )}

          {items.map((item) => (

            <button
              key={item.name}
              type="button"
              onClick={() => addItem(item)}
              className="block w-full border-b p-4 text-left transition hover:bg-green-50"
            >

              <div className="text-lg font-semibold">

                {item.name}

              </div>

              <div className="mt-1 text-sm text-gray-500">

                {item.unit} • SAR {item.cost}

              </div>

            </button>

          ))}

        </div>

        <div className="mt-6 flex justify-end">

          <button
            onClick={onClose}
            className="rounded-lg border px-6 py-3"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>

  );
}