"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

type Props = {
  components: number;
  kitchenSupplies: number;
};

export default function OrderTypeChart({
  components,
  kitchenSupplies,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        Order Types
      </h2>

      <Pie
        data={{
          labels: [
            "Components",
            "Kitchen Supplies",
          ],
          datasets: [
            {
              data: [
                components,
                kitchenSupplies,
              ],
            },
          ],
        }}
      />

    </div>
  );
}