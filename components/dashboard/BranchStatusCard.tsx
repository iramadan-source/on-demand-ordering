import { branches } from "@/data/branches";

type Props = {
  componentBranches: string[];
  kitchenBranches: string[];
};

export default function BranchStatusCard({
  componentBranches,
  kitchenBranches,
}: Props) {
  return (
    <div className="mt-8 rounded-2xl bg-white shadow-lg">

      <div className="flex items-center justify-between border-b p-6">

        <div>

          <h2 className="text-3xl font-bold">
            🏪 Branch Status
          </h2>

          <p className="mt-1 text-gray-500">
            Daily submission progress
          </p>

        </div>

      </div>

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="p-5 text-left">
              Branch
            </th>

            <th className="text-center">
              Components
            </th>

            <th className="text-center">
              Kitchen Supplies
            </th>

          </tr>

        </thead>

        <tbody>

          {branches.map((branch) => {

            const componentDone =
              componentBranches.includes(branch);

            const kitchenDone =
              kitchenBranches.includes(branch);

            return (

              <tr
                key={branch}
                className="border-t hover:bg-slate-50"
              >

                <td className="p-5 font-semibold">
                  {branch}
                </td>

                <td className="text-center">

                  <span
                    className={`rounded-full px-4 py-2 font-semibold ${
                      componentDone
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {componentDone
                      ? "✅ Submitted"
                      : "⏳ Pending"}
                  </span>

                </td>

                <td className="text-center">

                  <span
                    className={`rounded-full px-4 py-2 font-semibold ${
                      kitchenDone
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {kitchenDone
                      ? "✅ Submitted"
                      : "⏳ Pending"}
                  </span>

                </td>

              </tr>

            );

          })}

        </tbody>

      </table>

    </div>
  );
}