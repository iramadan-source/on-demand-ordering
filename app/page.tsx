import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-2">
          On Demand Ordering
        </h1>

        <p className="text-gray-600 mb-10">
          Central Kitchen Ordering System
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          <Link
            href="/orders"
            className="bg-white rounded-2xl shadow p-8 hover:shadow-xl transition block"
          >
            <h2 className="text-2xl font-semibold">
              Orders
            </h2>

            <p className="text-gray-500 mt-2">
              Create and manage branch orders
            </p>
          </Link>

          <Link
            href="/dashboard"
            className="bg-white rounded-2xl shadow p-8 hover:shadow-xl transition block"
          >
            <h2 className="text-2xl font-semibold">
              Dashboard
            </h2>

            <p className="text-gray-500 mt-2">
              View today's activity
            </p>
          </Link>

          <Link
            href="/branch-status"
            className="bg-white rounded-2xl shadow p-8 hover:shadow-xl transition block"
          >
            <h2 className="text-2xl font-semibold">
              Branch Status
            </h2>

            <p className="text-gray-500 mt-2">
              Track submitted branches
            </p>
          </Link>

          <Link
            href="/components"
            className="bg-white rounded-2xl shadow p-8 hover:shadow-xl transition block"
          >
            <h2 className="text-2xl font-semibold">
              Components
            </h2>

            <p className="text-gray-500 mt-2">
              Manage kitchen components
            </p>
          </Link>

          <Link
            href="/kitchen-supplies"
            className="bg-white rounded-2xl shadow p-8 hover:shadow-xl transition block"
          >
            <h2 className="text-2xl font-semibold">
              Kitchen Supplies
            </h2>

            <p className="text-gray-500 mt-2">
              Manage kitchen supplies
            </p>
          </Link>

          <Link
            href="/reports"
            className="bg-white rounded-2xl shadow p-8 hover:shadow-xl transition block"
          >
            <h2 className="text-2xl font-semibold">
              Reports
            </h2>

            <p className="text-gray-500 mt-2">
              Daily, Weekly and Monthly reports
            </p>
          </Link>

        </div>

      </div>
    </main>
  );
}