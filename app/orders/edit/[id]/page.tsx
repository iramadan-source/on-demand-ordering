"use client";

import { useParams } from "next/navigation";

import AppLayout from "@/components/AppLayout";
import OrderForm from "@/components/orders/OrderForm";

export default function EditOrderPage() {

  const params = useParams();

  return (

    <AppLayout>

      <h1 className="mb-8 text-5xl font-bold">
        Edit Order
      </h1>

      <OrderForm
        editMode={true}
        orderId={params.id as string}
      />

    </AppLayout>

  );

}