"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  PlusCircle,
  History,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [ordersOpen, setOrdersOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}

      <aside className="w-72 bg-slate-900 text-white shadow-xl">

        <div className="border-b border-slate-700 p-6">

          <h1 className="text-2xl font-bold">
            On Demand Ordering
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            CALO
          </p>

        </div>

        <nav className="space-y-2 p-4">

          <Link
            href="/dashboard"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
              pathname === "/dashboard"
                ? "bg-green-600"
                : "hover:bg-slate-800"
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <button
            onClick={() => setOrdersOpen(!ordersOpen)}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 hover:bg-slate-800"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart size={20} />
              Orders
            </div>

            {ordersOpen ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>

          {ordersOpen && (

            <div className="ml-8 space-y-2">

              <Link
                href="/orders"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                  pathname === "/orders"
                    ? "bg-green-600"
                    : "hover:bg-slate-800"
                }`}
              >
                <PlusCircle size={18} />
                New Order
              </Link>

              <Link
                href="/order-history"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                  pathname === "/order-history"
                    ? "bg-green-600"
                    : "hover:bg-slate-800"
                }`}
              >
                <History size={18} />
                Order History
              </Link>

              <Link
                href="/component-stats"
                className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                  pathname === "/component-stats"
                    ? "bg-green-600"
                    : "hover:bg-slate-800"
                }`}
              >
                <BarChart3 size={18} />
                Component Stats
              </Link>

            </div>

          )}

          <Link
            href="/branch-status"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
              pathname === "/branch-status"
                ? "bg-green-600"
                : "hover:bg-slate-800"
            }`}
          >
            <BarChart3 size={20} />
            Branch Status
          </Link>

          <Link
            href="/reports"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
              pathname === "/reports"
                ? "bg-green-600"
                : "hover:bg-slate-800"
            }`}
          >
            <BarChart3 size={20} />
            Reports
          </Link>

          <Link
            href="/settings"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
              pathname === "/settings"
                ? "bg-green-600"
                : "hover:bg-slate-800"
            }`}
          >
            <Settings size={20} />
            Settings
          </Link>

        </nav>

      </aside>

      {/* Main */}

      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  );
}