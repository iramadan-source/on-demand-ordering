type Branch = {
  id: string;
  name: string;
};

type Props = {
  orderDate: string;
  setOrderDate: (value: string) => void;

  branch: string;
  setBranch: (value: string) => void;

  requestType: string;
  setRequestType: (value: string) => void;

  branches: Branch[];
};

export default function OrderHeader({
  orderDate,
  setOrderDate,
  branch,
  setBranch,
  requestType,
  setRequestType,
  branches,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">

      <div className="grid grid-cols-3 gap-6">

        {/* Date */}

        <div>

          <label className="mb-2 block font-semibold">
            Date
          </label>

          <input
            type="date"
            value={orderDate}
            onChange={(e) =>
              setOrderDate(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />

        </div>

        {/* Branch */}

        <div>

          <label className="mb-2 block font-semibold">
            Branch
          </label>

          <select
            value={branch}
            onChange={(e) =>
              setBranch(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          >

            <option value="">
              Select Branch
            </option>

            {branches.map((branch) => (

              <option
                key={branch.id}
                value={branch.name}
              >
                {branch.name}
              </option>

            ))}

          </select>

        </div>

        {/* Request Type */}

        <div>

          <label className="mb-2 block font-semibold">
            Request Type
          </label>

          <select
            value={requestType}
            onChange={(e) =>
              setRequestType(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          >

            <option value="Components">
              Components
            </option>

            <option value="Kitchen Supplies">
              Kitchen Supplies
            </option>

          </select>

        </div>

      </div>

    </div>
  );
}