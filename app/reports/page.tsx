"use client";

import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import { branches } from "@/data/branches";
import OrderReportTable from "@/components/reports/OrderReportTable";
import BranchSummaryTable from "@/components/reports/BranchSummaryTable";
import * as XLSX from "xlsx";

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

  const filteredOrders =
    useMemo(() => {

      return orders.filter((order) => {

        if (
          selectedDate &&
          order.order_date !== selectedDate
        )
          return false;

        if (
          selectedBranch !== "All" &&
          order.branch !== selectedBranch
        )
          return false;

        if (
          selectedType !== "All" &&
          order.request_type !== selectedType
        )
          return false;

        return true;

      });

    }, [
      orders,
      selectedDate,
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

      {/* FILTERS */}

      <div className="mb-8 rounded-2xl bg-white p-6 shadow">

        <div className="grid grid-cols-3 gap-5">

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(e.target.value)
            }
            className="rounded-lg border p-3"
          />

          <select
            value={selectedBranch}
            onChange={(e) =>
              setSelectedBranch(e.target.value)
            }
            className="rounded-lg border p-3"
          >

            <option>All</option>

            {branches.map((branch) => (

              <option key={branch}>
                {branch}
              </option>

            ))}

          </select>

          <select
            value={selectedType}
            onChange={(e) =>
              setSelectedType(e.target.value)
            }
            className="rounded-lg border p-3"
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