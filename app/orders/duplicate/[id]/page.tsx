"use client";

import { useParams } from "next/navigation";

import AppLayout from "@/components/AppLayout";
import OrderForm from "@/components/orders/OrderForm";

export default function DuplicateOrderPage() {

  const params = useParams();

  return (
    <AppLayout>

      <h1 className="mb-8 text-5xl font-bold">
        Duplicate Order
      </h1>

      <OrderForm
        editMode={false}
        orderId={params.id as string}
      />

    </AppLayout>
  );
}