"use client";

import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";

import DateNavigator from "@/components/dashboard/DateNavigator";
import KpiCards from "@/components/dashboard/KpiCards";
import BranchStatusCard from "@/components/dashboard/BranchStatusCard";
import LatestOrdersCard from "@/components/dashboard/LatestOrdersCard";
import TopItemsCard from "@/components/dashboard/TopItemsCard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

import CostChart from "@/components/charts/CostChart";
import OrderTypeChart from "@/components/charts/OrderTypeChart";
import BranchChart from "@/components/charts/BranchChart";

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
  total_cost: number;
};

export default function DashboardPage() {

  const formatDate = (date: Date) =>
    date.toISOString().split("T")[0];

  const today = new Date();

const firstDay = new Date(
  today.getFullYear(),
  today.getMonth(),
  1
);

const [selectedDate, setSelectedDate] =
  useState(formatDate(firstDay));

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [orderItems, setOrderItems] =
    useState<OrderItem[]>([]);

  useEffect(() => {

    loadDashboard();

  }, [selectedDate]);

  async function loadDashboard() {

    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .gte("order_date", selectedDate)
.lte("order_date", formatDate(new Date()));

    const currentOrders = orderData || [];

    setOrders(currentOrders);

    if (currentOrders.length === 0) {

      setOrderItems([]);

      return;

    }

    const orderIds =
      currentOrders.map((o) => o.id);

    const { data: itemData } =
      await supabase
        .from("order_items")
        .select("*")
        .in("order_id", orderIds);

    setOrderItems(itemData || []);

  }

  function previousDay() {

    const d = new Date(selectedDate);

    d.setDate(d.getDate() - 1);

    setSelectedDate(formatDate(d));

  }

  function nextDay() {

    const d = new Date(selectedDate);

    d.setDate(d.getDate() + 1);

    setSelectedDate(formatDate(d));

  }

  const componentOrders =
    orders.filter(
      o => o.request_type === "Components"
    );

  const kitchenOrders =
    orders.filter(
      o =>
        o.request_type ===
        "Kitchen Supplies"
    );

      const componentSubmitted = [
    ...new Set(componentOrders.map((o) => o.branch)),
  ];

  const kitchenSubmitted = [
    ...new Set(kitchenOrders.map((o) => o.branch)),
  ];

  const componentCost = componentOrders.reduce(
    (sum, order) => sum + Number(order.grand_total),
    0
  );

  const kitchenCost = kitchenOrders.reduce(
    (sum, order) => sum + Number(order.grand_total),
    0
  );

  const componentQuantity = componentOrders.reduce(
    (sum, order) => {

      const qty = orderItems
        .filter((item) => item.order_id === order.id)
        .reduce(
          (total, item) =>
            total + Number(item.quantity),
          0
        );

      return sum + qty;

    },
    0
  );

  const kitchenQuantity = kitchenOrders.reduce(
    (sum, order) => {

      const qty = orderItems
        .filter((item) => item.order_id === order.id)
        .reduce(
          (total, item) =>
            total + Number(item.quantity),
          0
        );

      return sum + qty;

    },
    0
  );

  const latestComponentOrders = [...componentOrders]
    .sort((a, b) =>
      b.order_date.localeCompare(a.order_date)
    )
    .slice(0, 5);

  const latestKitchenOrders = [...kitchenOrders]
    .sort((a, b) =>
      b.order_date.localeCompare(a.order_date)
    )
    .slice(0, 5);

  const topItems = useMemo(() => {

    const totals: Record<string, number> = {};

    orderItems.forEach((item) => {

      totals[item.item_name] =
        (totals[item.item_name] || 0) +
        Number(item.quantity);

    });

    return Object.entries(totals)
      .map(([name, quantity]) => ({
        name,
        quantity,
      }))
      .sort(
        (a, b) => b.quantity - a.quantity
      )
      .slice(0, 10);

  }, [orderItems]);

  const costByDay = orders.reduce(
  (acc, order) => {

    acc[order.order_date] =
      (acc[order.order_date] || 0) +
      Number(order.grand_total);

    return acc;

  },
  {} as Record<string, number>
);

const costChartLabels =
  Object.keys(costByDay).sort();

const costChartValues =
  costChartLabels.map(
    (date) => costByDay[date]
  );

  const branchTotals = orders.reduce(
    (acc, order) => {

      acc[order.branch] =
        (acc[order.branch] || 0) + 1;

      return acc;

    },
    {} as Record<string, number>
  );

  const branchChartLabels =
    Object.keys(branchTotals);

  const branchChartValues =
    Object.values(branchTotals);

      return (
    <AppLayout>

      <DashboardHeader
  selectedDate={selectedDate}
  refresh={loadDashboard}
/>

      <DateNavigator
        selectedDate={selectedDate}
        previousDay={previousDay}
        nextDay={nextDay}
        onChange={setSelectedDate}
      />

      <KpiCards
        componentOrders={componentOrders.length}
        componentSubmitted={componentSubmitted.length}
        componentCost={componentCost}
        componentQuantity={componentQuantity}
        kitchenOrders={kitchenOrders.length}
        kitchenSubmitted={kitchenSubmitted.length}
        kitchenCost={kitchenCost}
        kitchenQuantity={kitchenQuantity}
      />

      <BranchStatusCard
        componentBranches={componentSubmitted}
        kitchenBranches={kitchenSubmitted}
      />

      <div className="mt-10 grid grid-cols-2 gap-8">

        <LatestOrdersCard
          title="Latest Component Orders"
          orders={latestComponentOrders}
        />

        <LatestOrdersCard
          title="Latest Kitchen Supply Orders"
          orders={latestKitchenOrders}
        />

      </div>

      <TopItemsCard
        title="Top Requested Items"
        items={topItems}
      />

      <div className="mt-10 grid grid-cols-2 gap-8">

        <CostChart
          labels={costChartLabels}
          values={costChartValues}
        />

        <OrderTypeChart
          components={componentOrders.length}
          kitchenSupplies={kitchenOrders.length}
        />

      </div>

      <div className="mt-10">

        <BranchChart
          labels={branchChartLabels}
          values={branchChartValues}
        />

      </div>

    </AppLayout>
  );

}