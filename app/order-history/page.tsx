"use client";

import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { branches } from "@/data/branches";

type Order = {
  id: string;
  order_date: string;
  branch: string;
  request_type: string;
  grand_total: number;
};

export default function OrderHistoryPage() {
  const router = useRouter();

  const today = new Date().toISOString().split("T")[0];

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");
  const [showOrders, setShowOrders] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("order_date", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setOrders(data || []);
  }

  async function deleteOrder(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    const { error: itemError } = await supabase
      .from("order_items")
      .delete()
      .eq("order_id", id);

    if (itemError) {
      alert(itemError.message);
      return;
    }

    const { error: orderError } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    if (orderError) {
      alert(orderError.message);
      return;
    }

    await loadOrders();
  }

  const uniqueDates = [
    ...new Set(orders.map((order) => order.order_date)),
  ];

  const filteredOrders = useMemo(() => {
  if (!showOrders) return [];

  return orders.filter((order) => {
      if (
        selectedDate !== "All" &&
        order.order_date !== selectedDate
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

      if (
        search &&
        !order.branch
          .toLowerCase()
          .includes(search.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [
    orders,
    selectedDate,
    selectedBranch,
    selectedType,
      search,
  showOrders,
]);

  const totalValue = filteredOrders.reduce(
    (total, order) =>
      total + Number(order.grand_total || 0),
    0
  );

  const totalBranches = new Set(
    filteredOrders.map((order) => order.branch)
  ).size;
    return (
    <AppLayout>

      <h1 className="mb-8 text-5xl font-bold">
        Order History
      </h1>

      {/* SUMMARY */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Orders
          </p>

          <p className="mt-2 text-3xl font-bold">
            {filteredOrders.length}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Branches
          </p>

          <p className="mt-2 text-3xl font-bold text-green-700">
            {totalBranches}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <p className="text-sm text-gray-500">
            Total Order Value
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-700">
            SAR {totalValue.toLocaleString()}
          </p>
        </div>

      </div>

      {/* FILTERS */}
      <div className="mb-8 rounded-2xl bg-white p-6 shadow">

        <div className="mb-4 flex flex-wrap gap-2">

  <button
    onClick={() => {
      setSelectedDate(today);
      setShowOrders(true);
    }}
    className="rounded-lg bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-800"
  >
    Today
  </button>

  <button
    onClick={() => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      setSelectedDate(
        yesterday.toISOString().split("T")[0]
      );
      setShowOrders(true);
    }}
    className="rounded-lg bg-gray-100 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-200"
  >
    Yesterday
  </button>

  <button
    onClick={() => {
      setSelectedDate("All");
      setShowOrders(true);
    }}
    className="rounded-lg bg-gray-100 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-200"
  >
    All Dates
  </button>

</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          <select
            className="rounded-lg border p-3"
            value={selectedDate}
            onChange={(e) => {
  setSelectedDate(e.target.value);
  setShowOrders(true);
}}
          >
            <option value="All">
              All Dates
            </option>

            {uniqueDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}

          </select>

          <select
            className="rounded-lg border p-3"
            value={selectedBranch}
            onChange={(e) => {
  setSelectedBranch(e.target.value);
  setShowOrders(true);
}}
          >
            <option value="All">
              All Branches
            </option>

            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}

          </select>

          <select
            className="rounded-lg border p-3"
            value={selectedType}
            onChange={(e) => {
  setSelectedType(e.target.value);
  setShowOrders(true);
}}
          >
            <option value="All">
              All Types
            </option>

            <option value="Components">
              Components
            </option>

            <option value="Kitchen Supplies">
              Kitchen Supplies
            </option>
          </select>

          <input
            className="rounded-lg border p-3"
            placeholder="Search Branch..."
            value={search}
            onChange={(e) => {
  setSearch(e.target.value);
  setShowOrders(true);
}}
          />

        </div>

        <div className="mt-4 flex justify-end">

          <button
            onClick={() => {
  setSelectedDate("All");
  setSelectedBranch("All");
  setSelectedType("All");
  setSearch("");
  setShowOrders(false);
}}
            className="rounded-lg bg-gray-200 px-5 py-2 font-semibold text-gray-700 hover:bg-gray-300"
          >
            Clear Filters
          </button>

        </div>

      </div>
            {/* ORDERS TABLE */}

      <div className="overflow-hidden rounded-2xl bg-white shadow">

        <table className="w-full">

          <thead className="bg-green-700 text-white">

            <tr>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-left">
                Branch
              </th>

              <th className="p-4 text-left">
                Type
              </th>

              <th className="p-4 text-right">
                Total
              </th>

              <th className="p-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredOrders.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="p-10 text-center text-gray-500"
                >
                  No orders found for the selected filters.
                </td>

              </tr>

            ) : (

              filteredOrders.map((order) => (

                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4">
                    {order.order_date}
                  </td>

                  <td className="p-4 font-medium">
                    {order.branch}
                  </td>

                  <td className="p-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                      {order.request_type}
                    </span>
                  </td>

                  <td className="p-4 text-right font-bold">
                    SAR{" "}
                    {Number(order.grand_total).toLocaleString()}
                  </td>

                  <td className="p-4">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() =>
                          router.push(`/orders/${order.id}`)
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          router.push(`/orders/edit/${order.id}`)
                        }
                        className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          router.push(
                            `/orders/duplicate/${order.id}`
                          )
                        }
                        className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                      >
                        Duplicate
                      </button>

                      <button
                        onClick={() =>
                          router.push(
                            `/orders/print/${order.id}`
                          )
                        }
                        className="rounded-lg bg-gray-700 px-4 py-2 text-white hover:bg-gray-800"
                      >
                        Print
                      </button>

                      <button
                        onClick={() =>
                          deleteOrder(order.id)
                        }
                        className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>
          </AppLayout>
  );
}