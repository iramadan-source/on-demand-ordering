"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";

type OrderItem = {
  item_name: string;
  unit: string;
  quantity: number;
  total_cost: number;
  orders: {
    branch: string;
    order_date: string;
    request_type: string;
  } | null;
};

type Detail = {
  branch: string;
  quantity: number;
};

type Stat = {
  name: string;
  unit: string;
  qty: number;
  cost: number;
  branches: string[];
  details: Detail[];
};

export default function ComponentStatsPage() {
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [stats, setStats] = useState<Stat[]>([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const totals = useMemo(
    () => ({
      components: stats.length,
      qty: stats.reduce((s, i) => s + i.qty, 0),
      cost: stats.reduce((s, i) => s + i.cost, 0),
      branches: new Set(stats.flatMap((i) => i.branches)).size,
    }),
    [stats]
  );

  useEffect(() => {
    loadStats();
  }, [selectedDate]);

  async function loadStats() {
    const { data, error } = await supabase
      .from("order_items")
      .select(`
        item_name,
        unit,
        quantity,
        total_cost,
        orders!inner(
          branch,
          order_date,
          request_type
        )
      `)
      .eq("orders.order_date", selectedDate)
      .eq("orders.request_type", "Components");

    if (error) {
      console.error("Supabase Error:", error);
      return;
    }

    console.log("Selected Date:", selectedDate);
    console.log("Returned Data:", data);

    const grouped: Record<string, Stat> = {};

    (data as unknown as OrderItem[]).forEach((row) => {
      const branch = row.orders?.branch;

      if (!branch) return;

      if (!grouped[row.item_name]) {
        grouped[row.item_name] = {
          name: row.item_name,
          unit: row.unit,
          qty: 0,
          cost: 0,
          branches: [],
          details: [],
        };
      }

      grouped[row.item_name].qty += row.quantity;
      grouped[row.item_name].cost += row.total_cost;

      if (!grouped[row.item_name].branches.includes(branch)) {
        grouped[row.item_name].branches.push(branch);
      }

      const existingDetail = grouped[row.item_name].details.find(
        (d) => d.branch === branch
      );

      if (existingDetail) {
        existingDetail.quantity += row.quantity;
      } else {
        grouped[row.item_name].details.push({
          branch,
          quantity: row.quantity,
        });
      }
    });

    setStats(
      Object.values(grouped).sort((a, b) => {
        if (b.qty !== a.qty) {
          return b.qty - a.qty;
        }

        return a.name.localeCompare(b.name);
      })
    );
  }

  function exportToExcel() {
    const rows = stats.flatMap((item) =>
      item.details.map((detail) => ({
        Date: selectedDate,
        Component: item.name,
        Unit: item.unit,
        Branch: detail.branch,
        Quantity: detail.quantity,
        "Total Component Qty": item.qty,
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(rows);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Component Stats"
    );

    XLSX.writeFile(
      workbook,
      `Component-Stats-${selectedDate}.xlsx`
    );
  }
    return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold">
            Component Stats
          </h1>

          <p className="mt-2 text-gray-500">
            Daily Production Summary
          </p>
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="rounded-lg border p-3"
        />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Components
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {totals.components}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Total Qty
          </p>

          <h2 className="mt-2 text-4xl font-bold text-green-700">
            {totals.qty.toLocaleString()}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Total Cost
          </p>

          <h2 className="mt-2 text-4xl font-bold text-blue-700">
            SAR {totals.cost.toFixed(2)}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Branches
          </p>

          <h2 className="mt-2 text-4xl font-bold text-orange-600">
            {totals.branches}
          </h2>
        </div>

      </div>

      <div className="mt-8 mb-4 flex justify-end gap-3">

        <input
          type="text"
          placeholder="Search Component..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 rounded-xl border p-3 shadow-sm"
        />

        <button
          onClick={exportToExcel}
          className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white shadow hover:bg-green-800"
        >
          Export Excel
        </button>
        <button
  onClick={() => window.print()}
  className="rounded-xl bg-slate-700 px-6 py-3 font-semibold text-white shadow hover:bg-slate-800"
>
  Print
</button>

      </div>
      
            <div className="overflow-hidden rounded-2xl bg-white shadow">

        <table className="w-full">

          <thead className="bg-green-700 text-white">

            <tr>

              <th className="p-4 text-left">
                Component
              </th>

              <th className="text-center">
                Unit
              </th>

              <th className="text-center">
                Qty
              </th>

              <th className="text-center">
                Requested By
              </th>

              <th className="print-hide-cost text-center">
                Cost
              </th>

            </tr>

          </thead>

          <tbody>

            {stats
              .filter((item) =>
                item.name
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((item) => (
                <Fragment key={item.name}>

                  <tr
                    className="cursor-pointer border-b hover:bg-gray-50"
                    onClick={() =>
                      setExpanded(
                        expanded === item.name
                          ? null
                          : item.name
                      )
                    }
                  >

                    <td className="p-4 font-semibold">
                      {expanded === item.name ? "▼" : "▶"}{" "}
                      {item.name}
                    </td>

                    <td className="text-center">
                      {item.unit}
                    </td>

                    <td className="text-center">

                      <span
                        className={`rounded-full px-3 py-1 font-bold ${
                          item.qty >= 100
                            ? "bg-red-100 text-red-700"
                            : item.qty >= 50
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.qty.toLocaleString()}
                      </span>

                    </td>

                    <td className="p-3">

                      <div className="flex flex-wrap justify-center gap-2">

                        {item.branches.map((branch) => (
                          <span
                            key={branch}
                            className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
                          >
                            {branch}
                          </span>
                        ))}

                      </div>

                    </td>

                    <td className="print-hide-cost text-center">
                      SAR {item.cost.toFixed(2)}
                    </td>

                  </tr>

                  {expanded === item.name && (

                    <tr>

                      <td
                        colSpan={5}
                        className="bg-slate-50 px-8 py-5"
                      >

                        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

                          {item.details.map((d, i) => (

                            <div
                              key={`${d.branch}-${i}`}
                              className="rounded-xl border border-green-100 bg-white p-3 shadow-sm"
                            >

                              <p className="text-xs text-gray-500">
                                Branch
                              </p>

                              <p className="font-semibold text-green-700">
                                {d.branch}
                              </p>

                              <p className="mt-2 text-xs text-gray-500">
                                Quantity
                              </p>

                              <p className="text-lg font-bold">
                                {d.quantity.toLocaleString()}{" "}
                                {item.unit}
                              </p>

                            </div>

                          ))}

                        </div>

                      </td>

                    </tr>

                  )}

                </Fragment>
              ))}

          </tbody>

        </table>

      </div>
            <div className="mt-6 text-sm text-gray-500">
        Click any component row to view the branch quantities.
      </div>

    </AppLayout>
  );
}