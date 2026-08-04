"use client";

import { RefreshCw, Clock } from "lucide-react";

type Props = {
  selectedDate: string;
  refresh: () => void;
};

export default function DashboardHeader({
  selectedDate,
  refresh,
}: Props) {
  return (
    <div className="mb-8 rounded-2xl bg-white p-6 shadow">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Operations Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            On Demand Ordering Management
          </p>

        </div>

        <div className="flex items-center gap-8">

          <div className="text-right">

            <div className="flex items-center gap-2 text-gray-500">

              <Clock size={18} />

              Selected Date

            </div>

            <h2 className="text-2xl font-bold">
              {selectedDate}
            </h2>

          </div>

          <button
            onClick={refresh}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-white hover:bg-green-700"
          >

            <RefreshCw size={18} />

            Refresh

          </button>

        </div>

      </div>

    </div>
  );
}