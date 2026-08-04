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

  const [orders, setOrders] = useState<Order[]>([]);

  const [selectedDate, setSelectedDate] = useState("All");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");

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

  const uniqueDates = [...new Set(orders.map((o) => o.order_date))];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (
        selectedDate !== "All" &&
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

      if (
        search &&
        !order.branch
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;

      return true;
    });
  }, [
    orders,
    selectedDate,
    selectedBranch,
    selectedType,
    search,
  ]);

  return (
    <AppLayout>

      <h1 className="mb-8 text-5xl font-bold">
        Order History
      </h1>

      <div className="mb-8 rounded-2xl bg-white p-6 shadow">

        <div className="grid grid-cols-4 gap-4">

          <select
            className="rounded-lg border p-3"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option>All</option>

            {uniqueDates.map((date) => (
              <option key={date}>{date}</option>
            ))}

          </select>

          <select
            className="rounded-lg border p-3"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option>All</option>

            {branches.map((branch) => (
              <option key={branch}>{branch}</option>
            ))}

          </select>

          <select
            className="rounded-lg border p-3"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option>All</option>
            <option>Components</option>
            <option>Kitchen Supplies</option>
          </select>

          <input
            className="rounded-lg border p-3"
            placeholder="Search Branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>

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

            {filteredOrders.map((order) => (

              <tr
                key={order.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-4">
                  {order.order_date}
                </td>

                <td className="p-4">
                  {order.branch}
                </td>

                <td className="p-4">
                  {order.request_type}
                </td>

                <td className="p-4 text-right font-bold">
                  SAR {Number(order.grand_total).toLocaleString()}
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
    router.push(`/orders/duplicate/${order.id}`)
  }
  className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
>
  Duplicate
</button>

<button
  onClick={() =>
    router.push(`/orders/print/${order.id}`)
  }
  className="rounded-lg bg-gray-700 px-4 py-2 text-white hover:bg-gray-800"
>
  Print
</button>

                    <button
  onClick={() => deleteOrder(order.id)}
  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
>
  Delete
</button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </AppLayout>
  );
}