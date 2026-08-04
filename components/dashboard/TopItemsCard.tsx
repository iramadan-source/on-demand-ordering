type TopItem = {
  name: string;
  quantity: number;
};

type Props = {
  title: string;
  items: TopItem[];
};

export default function TopItemsCard({
  title,
  items,
}: Props) {
  return (
    <div className="mt-10 rounded-2xl bg-white shadow overflow-hidden">

      <div className="border-b p-6">

        <h2 className="text-3xl font-bold">
          {title}
        </h2>

      </div>

      <div className="p-6">

        {items.length === 0 ? (

          <div className="py-8 text-center text-gray-500">
            No data available.
          </div>

        ) : (

          <div className="space-y-4">

            {items.map((item, index) => (

              <div
                key={item.name}
                className="flex items-center justify-between rounded-xl border p-4 hover:bg-gray-50"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 font-bold text-white">

                    {index + 1}

                  </div>

                  <div>

                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                  </div>

                </div>

                <div className="text-xl font-bold text-green-700">

                  {item.quantity}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}