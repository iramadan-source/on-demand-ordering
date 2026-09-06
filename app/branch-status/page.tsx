"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import { branches } from "@/data/branches";

type Order = {
  id: string;
  branch: string;
  order_date: string;
  request_type: string;
  created_at: string;
};

function getSaudiDate() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Riyadh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year =
    parts.find((part) => part.type === "year")?.value;

  const month =
    parts.find((part) => part.type === "month")?.value;

  const day =
    parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function formatSaudiTime(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Riyadh",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatSaudiDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Riyadh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export default function BranchStatusPage() {
  const [selectedDate, setSelectedDate] =
    useState(getSaudiDate());

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [currentTime, setCurrentTime] =
    useState(new Date());

  /*
   * LIVE CLOCK
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /*
   * LOAD ORDERS FOR SELECTED DATE
   */
  useEffect(() => {
    loadOrders();
  }, [selectedDate]);

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_date", selectedDate);

    if (error) {
      console.error("Failed to load branch status:", error);
      setOrders([]);
      return;
    }

    setOrders((data as Order[]) || []);
  }

  /*
   * ONLY COMPONENT ORDERS COUNT
   * TOWARD DAILY BRANCH SUBMISSION
   */
  const componentOrders = orders.filter(
    (order) =>
      order.request_type === "Components"
  );

  const completedBranches = new Set(
    componentOrders.map(
      (order) => order.branch
    )
  );

  const completed =
    completedBranches.size;

  const pending =
    Math.max(
      branches.length - completed,
      0
    );

  const completion =
    branches.length > 0
      ? Math.min(
          100,
          Math.round(
            (completed / branches.length) *
              100
          )
        )
      : 0;

  /*
   * 10:00 PM SAUDI TIME
   * FOR THE SELECTED DATE
   */
  const deadline = new Date(
    `${selectedDate}T22:00:00+03:00`
  );

  const remainingMs =
    deadline.getTime() -
    currentTime.getTime();

  const hours = Math.max(
    0,
    Math.floor(
      remainingMs /
        1000 /
        60 /
        60
    )
  );

  const minutes = Math.max(
    0,
    Math.floor(
      (remainingMs /
        1000 /
        60) %
        60
    )
  );

  const seconds = Math.max(
    0,
    Math.floor(
      (remainingMs /
        1000) %
        60
    )
  );

  const deadlinePassed =
    remainingMs <= 0;

  /*
   * CHECK IF SELECTED DATE IS TODAY
   */
  const isToday =
    selectedDate === getSaudiDate();

  return (
    <AppLayout>

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-5xl font-bold">
            Branch Status
          </h1>

          <p className="mt-2 text-gray-500">
            Daily Submission Tracker
          </p>
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) =>
            setSelectedDate(
              e.target.value
            )
          }
          className="rounded-lg border p-3"
        />

      </div>

      {/* KPI CARDS */}

      <div className="mt-8 grid gap-6 md:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-gray-500">
            Total Branches
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {branches.length}
          </h2>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-gray-500">
            Submitted
          </p>

          <h2 className="mt-2 text-4xl font-bold text-green-700">
            {completed}
          </h2>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-gray-500">
            Pending
          </p>

          <h2 className="mt-2 text-4xl font-bold text-red-600">
            {pending}
          </h2>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-gray-500">
            Completion
          </p>

          <h2 className="mt-2 text-4xl font-bold text-blue-600">
            {completion}%
          </h2>

        </div>

      </div>

      {/* PROGRESS */}

      <div className="mt-6 rounded-2xl bg-white p-6 shadow">

        <div className="mb-2 flex justify-between text-sm">

          <span className="font-medium">
            Component Submission Progress
          </span>

          <span className="font-bold">
            {completed} / {branches.length}
          </span>

        </div>

        <div className="h-4 overflow-hidden rounded-full bg-gray-200">

          <div
            className="h-full bg-green-600 transition-all duration-500"
            style={{
              width: `${completion}%`,
            }}
          />

        </div>

        <p className="mt-2 text-sm text-gray-500">
          {completion}% of branches submitted Components
        </p>

      </div>

      {/* DEADLINE */}

      <div className="mt-6 rounded-2xl bg-white p-6 shadow">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-xl font-bold">
              Submission Deadline
            </h2>

            <p className="text-gray-500">
              Daily Components Cutoff
            </p>

          </div>

          <div className="text-right">

            <div className="text-sm text-gray-500">
              Deadline
            </div>

            <div className="text-2xl font-bold">
              10:00 PM
            </div>

          </div>

        </div>

        <div className="mt-6">

          {!isToday ? (

            <div className="text-lg font-semibold text-gray-500">
              {deadlinePassed
                ? "Deadline Passed"
                : "Future Date"}
            </div>

          ) : deadlinePassed ? (

            <div className="text-3xl font-bold text-red-600">
              🔴 Deadline Passed
            </div>

          ) : (

            <div className="text-3xl font-bold text-green-700">
              ⏰ {hours}h {minutes}m {seconds}s
            </div>

          )}

        </div>

      </div>

      {/* TABLE */}

      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow">

        <table className="w-full">

          <thead className="bg-green-700 text-white">

            <tr>

              <th className="p-4 text-left">
                Branch
              </th>

              <th className="text-center">
                Components
              </th>

              <th className="text-center">
                Kitchen Supplies
              </th>

              <th className="text-center">
                Last Request
              </th>

              <th className="text-center">
                Status
              </th>

              <th className="text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {branches.map((branch) => {

              /*
               * COMPONENT ORDER
               */

              const componentOrder =
                orders
                  .filter(
                    (order) =>
                      order.branch ===
                        branch &&
                      order.request_type ===
                        "Components"
                  )
                  .sort(
                    (a, b) =>
                      new Date(
                        b.created_at
                      ).getTime() -
                      new Date(
                        a.created_at
                      ).getTime()
                  )[0];

              /*
               * KITCHEN SUPPLY ORDER
               */

              const kitchenOrder =
                orders
                  .filter(
                    (order) =>
                      order.branch ===
                        branch &&
                      order.request_type ===
                        "Kitchen Supplies"
                  )
                  .sort(
                    (a, b) =>
                      new Date(
                        b.created_at
                      ).getTime() -
                      new Date(
                        a.created_at
                      ).getTime()
                  )[0];

              /*
               * MOST RECENT REQUEST
               */

              const lastOrder =
                [
                  componentOrder,
                  kitchenOrder,
                ]
                  .filter(
                    (
                      order
                    ): order is Order =>
                      order !==
                      undefined
                  )
                  .sort(
                    (a, b) =>
                      new Date(
                        b.created_at
                      ).getTime() -
                      new Date(
                        a.created_at
                      ).getTime()
                  )[0];

              /*
               * COMPONENT STATUS
               *
               * Deadline applies to Components.
               */

              let componentStatus =
                "No Request";

              let componentStatusColor =
                "bg-gray-100 text-gray-700";

              if (componentOrder) {

                const submittedAt =
                  new Date(
                    componentOrder.created_at
                  );

                if (
                  submittedAt.getTime() <=
                  deadline.getTime()
                ) {

                  componentStatus =
                    "Submitted";

                  componentStatusColor =
                    "bg-green-100 text-green-700";

                } else {

                  componentStatus =
                    "Late";

                  componentStatusColor =
                    "bg-yellow-100 text-yellow-700";

                }

              } else if (
                deadlinePassed
              ) {

                componentStatus =
                  "Overdue";

                componentStatusColor =
                  "bg-red-100 text-red-700";
              }

              /*
               * OVERALL BRANCH STATUS
               */

              let status = "Awaiting";

              let statusColor =
                "bg-gray-100 text-gray-700";

              if (componentOrder) {

                const submittedAt =
                  new Date(
                    componentOrder.created_at
                  );

                if (
                  submittedAt.getTime() <=
                  deadline.getTime()
                ) {

                  status = "On Time";

                  statusColor =
                    "bg-green-100 text-green-700";

                } else {

                  status = "Late";

                  statusColor =
                    "bg-yellow-100 text-yellow-700";

                }

              } else if (
                deadlinePassed
              ) {

                status = "Overdue";

                statusColor =
                  "bg-red-100 text-red-700";
              }

              return (

                <tr
                  key={branch}
                  className="border-b hover:bg-gray-50"
                >

                  {/* BRANCH */}

                  <td className="p-4 font-semibold">
                    {branch}
                  </td>

                  {/* COMPONENTS */}

                  <td className="text-center">

                    <span
                      className={`rounded-full px-3 py-1 font-medium ${componentStatusColor}`}
                    >
                      {componentStatus}
                    </span>

                  </td>

                  {/* KITCHEN SUPPLIES */}

                  <td className="text-center">

                    {kitchenOrder ? (

                      <span className="font-semibold text-green-700">
                        ✅ Submitted
                      </span>

                    ) : (

                      <span className="text-gray-500">
                        No Request
                      </span>

                    )}

                  </td>

                  {/* LAST REQUEST */}

                  <td className="text-center">

                    {lastOrder ? (

                      <div>

                        <div className="font-semibold">

                          {formatSaudiTime(
                            lastOrder.created_at
                          )}

                        </div>

                        <div className="text-xs text-gray-500">
  {formatSaudiDate(`${selectedDate}T00:00:00+03:00`)}
</div>

                      </div>

                    ) : (

                      <span className="text-gray-400">
                        —
                      </span>

                    )}

                  </td>

                  {/* STATUS */}

                  <td className="text-center">

                    <span
                      className={`rounded-full px-3 py-1 font-semibold ${statusColor}`}
                    >
                      {status}
                    </span>

                  </td>

                  {/* ACTION */}

                  <td className="text-center">

                    {lastOrder ? (

                      <Link
                        href={`/orders/edit/${lastOrder.id}`}
                        className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                      >
                        View
                      </Link>

                    ) : (

                      <Link
                        href="/orders"
                        className="inline-block rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800"
                      >
                        New Order
                      </Link>

                    )}

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

    </AppLayout>
  );
}