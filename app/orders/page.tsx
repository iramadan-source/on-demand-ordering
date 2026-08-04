"use client";

import AppLayout from "@/components/AppLayout";
import OrderForm from "@/components/orders/OrderForm";

export default function OrdersPage() {
  return (
    <AppLayout>

      <h1 className="mb-10 text-5xl font-bold">
        New Order
      </h1>

      <OrderForm />

    </AppLayout>
  );
}