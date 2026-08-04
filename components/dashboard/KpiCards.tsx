type Props = {
  componentOrders: number;
  componentSubmitted: number;
  componentCost: number;
  componentQuantity: number;

  kitchenOrders: number;
  kitchenSubmitted: number;
  kitchenCost: number;
  kitchenQuantity: number;
};

type CardProps = {
  title: string;
  icon: string;
  orders: number;
  submitted: number;
  totalBranches: number;
  cost: number;
  quantity: number;
};

function DashboardCard({
  title,
  icon,
  orders,
  submitted,
  totalBranches,
  cost,
  quantity,
}: CardProps) {
  const percentage =
    totalBranches === 0
      ? 0
      : Math.round((submitted / totalBranches) * 100);

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            {icon} {title}
          </h2>

          <p className="text-sm text-gray-500">
            Daily Summary
          </p>

        </div>

        <div className="rounded-xl bg-green-100 px-4 py-2">

          <span className="text-2xl font-bold text-green-700">
            {percentage}%
          </span>

        </div>

      </div>

      <div className="grid grid-cols-2 gap-6">

        <div className="rounded-xl bg-slate-50 p-4">

          <p className="text-gray-500">
            Orders
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {orders}
          </h3>

        </div>

        <div className="rounded-xl bg-slate-50 p-4">

          <p className="text-gray-500">
            Submitted
          </p>

          <h3 className="mt-2 text-3xl font-bold text-green-700">
            {submitted}/{totalBranches}
          </h3>

        </div>

        <div className="rounded-xl bg-slate-50 p-4">

          <p className="text-gray-500">
            Total Cost
          </p>

          <h3 className="mt-2 text-2xl font-bold text-green-700">
            SAR {cost.toLocaleString()}
          </h3>

        </div>

        <div className="rounded-xl bg-slate-50 p-4">

          <p className="text-gray-500">
            Quantity
          </p>

          <h3 className="mt-2 text-3xl font-bold">
            {quantity}
          </h3>

        </div>

      </div>

      <div className="mt-8">

        <div className="mb-2 flex justify-between">

          <span className="text-sm text-gray-500">
            Branch Completion
          </span>

          <span className="font-semibold">
            {percentage}%
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-gray-200">

          <div
            className="h-3 rounded-full bg-green-600 transition-all"
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}

export default function KpiCards({
  componentOrders,
  componentSubmitted,
  componentCost,
  componentQuantity,
  kitchenOrders,
  kitchenSubmitted,
  kitchenCost,
  kitchenQuantity,
}: Props) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">

      <DashboardCard
        title="Components"
        icon="📦"
        orders={componentOrders}
        submitted={componentSubmitted}
        totalBranches={10}
        cost={componentCost}
        quantity={componentQuantity}
      />

      <DashboardCard
        title="Kitchen Supplies"
        icon="🧴"
        orders={kitchenOrders}
        submitted={kitchenSubmitted}
        totalBranches={10}
        cost={kitchenCost}
        quantity={kitchenQuantity}
      />

    </div>
  );
}