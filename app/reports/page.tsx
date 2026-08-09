"use client";

import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import { branches } from "@/data/branches";
import OrderReportTable from "@/components/reports/OrderReportTable";
import BranchSummaryTable from "@/components/reports/BranchSummaryTable";
import * as XLSX from "xlsx";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";

type Order = {
  id: string;
  order_date: string;
  branch: string;
  request_type: string;
  grand_total: number;
};

type OrderItem = {
  order_id: string;
  item_name: string;
  quantity: number;
};

export default function ReportsPage() {

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const [selectedDate, setSelectedDate] =
useState(today);

const [reportMode, setReportMode] =
useState<"Daily" | "Weekly" | "Monthly">("Daily");
const [weeklyRange, setWeeklyRange] =
useState<DateRange | undefined>();

  const [selectedBranch, setSelectedBranch] =
    useState("All");

  const [selectedType, setSelectedType] =
    useState("All");

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [items, setItems] =
    useState<OrderItem[]>([]);

  useEffect(() => {

    loadData();

  }, []);

  async function loadData() {

    const { data: orderData } =
      await supabase
        .from("orders")
        .select("*");

    const { data: itemData } =
      await supabase
        .from("order_items")
        .select("*");

    setOrders(orderData || []);

    setItems(itemData || []);

  }

  function exportExcel() {

  const data = filteredOrders.map((order) => ({

    Date: order.order_date,

    Branch: order.branch,

    "Request Type": order.request_type,

    "Grand Total": order.grand_total,

  }));

  const worksheet =
    XLSX.utils.json_to_sheet(data);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Orders"
  );

  XLSX.writeFile(
    workbook,
    "Orders_Report.xlsx"
  );

}

  const filteredOrders = useMemo(() => {

  let startDate = selectedDate;
  let endDate = selectedDate;

  if (reportMode === "Weekly") {

  if (!weeklyRange?.from) {
    return [];
  }

  startDate =
    weeklyRange.from
      .toISOString()
      .split("T")[0];

  endDate =
    weeklyRange.to
      ? weeklyRange.to
          .toISOString()
          .split("T")[0]
      : startDate;

}

  if (reportMode === "Monthly") {

    const selected = new Date(
      `${selectedDate}T00:00:00`
    );

    const start = new Date(
      selected.getFullYear(),
      selected.getMonth(),
      1
    );

    const end = new Date(
      selected.getFullYear(),
      selected.getMonth() + 1,
      0
    );

    startDate = start
      .toISOString()
      .split("T")[0];

    endDate = end
      .toISOString()
      .split("T")[0];
  }

  return orders.filter((order) => {

    if (
      order.order_date < startDate ||
      order.order_date > endDate
    ) {
      return false;
    }

    if (
      selectedBranch !== "All" &&
      order.branch !== selectedBranch
    ) {
      return false;
    }

    if (
      selectedType !== "All" &&
      order.request_type !== selectedType
    ) {
      return false;
    }

    return true;
  });

}, [
  orders,
  selectedDate,
  weeklyRange,
  reportMode,
  selectedBranch,
  selectedType,
]);

  const totalOrders =
    filteredOrders.length;

  const totalBranches =
    new Set(
      filteredOrders.map(
        (o) => o.branch
      )
    ).size;

  const totalCost =
    filteredOrders.reduce(
      (sum, order) =>
        sum + Number(order.grand_total),
      0
    );

  const totalItems =
    items
      .filter((item) =>
        filteredOrders.some(
          (o) => o.id === item.order_id
        )
      )
      .reduce(
        (sum, item) =>
          sum + Number(item.quantity),
        0
      );

        const componentOrders =
    filteredOrders.filter(
      (o) => o.request_type === "Components"
    ).length;

  const kitchenOrders =
    filteredOrders.filter(
      (o) =>
        o.request_type ===
        "Kitchen Supplies"
    ).length;

  return (

    <AppLayout>

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Reports
          </h1>

          <p className="mt-2 text-gray-500">
            Operations & Management Dashboard
          </p>

        </div>

      </div>

      {/* REPORT FILTERS */}

<div className="mb-8 rounded-2xl bg-white p-6 shadow">

  <div className="mb-5 flex flex-wrap gap-3">

    {(["Daily", "Weekly", "Monthly"] as const).map((mode) => (

      <button
  key={mode}
  type="button"
  onClick={() => {
    setReportMode(mode);

    if (mode === "Weekly") {
      setWeeklyRange(undefined);
    }
  }}
  className={`rounded-lg px-6 py-3 font-semibold transition ${
    reportMode === mode
      ? "bg-green-700 text-white"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  }`}
>
  {mode}
</button>

    ))}

  </div>

  <div className="grid grid-cols-3 gap-5">

    {/* DATE / DATE RANGE */}

    <div>

      <label className="mb-2 block text-sm font-semibold text-gray-600">
        {reportMode === "Daily"
          ? "Date"
          : reportMode === "Weekly"
          ? "Date Range"
          : "Month"}
      </label>

      {reportMode === "Weekly" ? (

        <div className="relative">

          <button
            type="button"
            onClick={() => {
              const calendar =
                document.getElementById("weekly-calendar");

              calendar?.classList.toggle("hidden");
            }}
            className="w-full rounded-lg border bg-white p-3 text-left hover:bg-gray-50"
          >

            {weeklyRange?.from ? (

              <>
                {weeklyRange.from.toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )}

                {" → "}

                {weeklyRange.to
                  ? weeklyRange.to.toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "Select end date"}
              </>

            ) : (

              <span className="text-gray-400">
                Select date range
              </span>

            )}

          </button>

          <div
  id="weekly-calendar"
  className="absolute left-0 top-full z-50 mt-2 hidden rounded-xl border bg-white p-4 shadow-xl"
>

            <DayPicker
  mode="range"
  selected={weeklyRange}
  onSelect={(range) => {
  const hadStartDate = !!weeklyRange?.from;

  setWeeklyRange(range);

  // Close ONLY after selecting the second date
  if (hadStartDate && range?.to) {
    document
      .getElementById("weekly-calendar")
      ?.classList.add("hidden");
  }
}}
  numberOfMonths={2}
  pagedNavigation
  showOutsideDays
/>

          </div>

        </div>

      ) : (

        <input
          type={
            reportMode === "Monthly"
              ? "month"
              : "date"
          }
          value={
            reportMode === "Monthly"
              ? selectedDate.slice(0, 7)
              : selectedDate
          }
          onChange={(e) => {

            if (reportMode === "Monthly") {

              setSelectedDate(
                `${e.target.value}-01`
              );

            } else {

              setSelectedDate(
                e.target.value
              );

            }

          }}
          className="w-full rounded-lg border p-3"
        />

      )}

    </div>

    {/* BRANCH */}

    <div>

      <label className="mb-2 block text-sm font-semibold text-gray-600">
        Branch
      </label>

      <select
        value={selectedBranch}
        onChange={(e) =>
          setSelectedBranch(e.target.value)
        }
        className="w-full rounded-lg border p-3"
      >

        <option>All</option>

        {branches.map((branch) => (

          <option key={branch}>
            {branch}
          </option>

        ))}

      </select>

    </div>

    {/* REQUEST TYPE */}

    <div>

      <label className="mb-2 block text-sm font-semibold text-gray-600">
        Request Type
      </label>

      <select
        value={selectedType}
        onChange={(e) =>
          setSelectedType(e.target.value)
        }
        className="w-full rounded-lg border p-3"
      >

        <option>All</option>

        <option>
          Components
        </option>

        <option>
          Kitchen Supplies
        </option>

      </select>

    </div>

  </div>

</div>


      {/* KPI CARDS */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-gray-500">
            Orders
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {totalOrders}
          </h2>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-gray-500">
            Items Requested
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {totalItems}
          </h2>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-gray-500">
            Branches
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {totalBranches}
          </h2>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-gray-500">
            Total Cost
          </p>

          <h2 className="mt-2 text-4xl font-bold text-green-700">
            SAR {totalCost.toLocaleString()}
          </h2>

        </div>

      </div>

            {/* Request Type Summary */}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl bg-white p-6 shadow">

          <h2 className="mb-6 text-2xl font-bold">
            Orders by Request Type
          </h2>

          <div className="space-y-4">

            <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">

              <span className="font-semibold">
                Components
              </span>

              <span className="text-2xl font-bold text-green-700">
                {componentOrders}
              </span>

            </div>

            <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">

              <span className="font-semibold">
                Kitchen Supplies
              </span>

              <span className="text-2xl font-bold text-blue-700">
                {kitchenOrders}
              </span>

            </div>

          </div>

        </div>

        {/* Top Requested Items */}

        <div className="rounded-2xl bg-white p-6 shadow">

          <h2 className="mb-6 text-2xl font-bold">
            Top Requested Items
          </h2>

          {Object.entries(

            items
              .filter((item) =>
                filteredOrders.some(
                  (o) => o.id === item.order_id
                )
              )
              .reduce((acc, item) => {

                acc[item.item_name] =
                  (acc[item.item_name] || 0) +
                  Number(item.quantity);

                return acc;

              }, {} as Record<string, number>)

          )
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([name, qty]) => (

              <div
                key={name}
                className="mb-3 flex items-center justify-between border-b pb-2"
              >

                <span>
                  {name}
                </span>

                <span className="font-bold text-green-700">
                  {qty}
                </span>

              </div>

            ))}

        </div>

      </div>

      <OrderReportTable
  orders={filteredOrders}
/>
      <BranchSummaryTable
  orders={filteredOrders}
  items={items.filter((item) =>
    filteredOrders.some(
      (order) => order.id === item.order_id
    )
  )}
/>
      {/* Export */}

      <div className="mt-8 rounded-2xl bg-white p-6 shadow">

        <h2 className="mb-6 text-2xl font-bold">
          Export Report
        </h2>

        <div className="flex gap-4">

          <button
  onClick={exportExcel}
  className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
>
  Export Excel
</button>


          <button
            onClick={() => window.print()}
            className="rounded-lg bg-gray-700 px-6 py-3 font-semibold text-white hover:bg-gray-800"
          >
            Print Report
          </button>

        </div>

      </div>

    </AppLayout>

  );

}