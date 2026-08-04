"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

type Props = {
  labels: string[];
  values: number[];
};

export default function CostChart({
  labels,
  values,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        Daily Cost Trend
      </h2>

      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Cost",
              data: values,
              borderWidth: 3,
              tension: 0.4,
            },
          ],
        }}
      />

    </div>
  );
}