"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AppLayout from "@/components/AppLayout";
import { useParams } from "next/navigation";

type Order = {
  id: string;
  order_date: string;
  branch: string;
  request_type: string;
  grand_total: number;
};

type Item = {
  item_name: string;
  unit: string;
  quantity: number;
  unit_cost: number;
};

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    loadOrder();
  }, []);

  async function loadOrder() {

    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    setOrder(orderData);

    const { data: itemData } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id);

    setItems(itemData || []);
  }

  if (!order)
    return <AppLayout>Loading...</AppLayout>;

  return (
    <AppLayout>

      <h1 className="mb-8 text-5xl font-bold">
        Order Details
      </h1>

      <div className="mb-8 rounded-xl bg-white p-6 shadow">

        <div className="grid grid-cols-4 gap-6">

          <div>

            <p className="text-gray-500">
              Date
            </p>

            <h2 className="text-xl font-bold">
              {order.order_date}
            </h2>

          </div>

          <div>

            <p className="text-gray-500">
              Branch
            </p>

            <h2 className="text-xl font-bold">
              {order.branch}
            </h2>

          </div>

          <div>

            <p className="text-gray-500">
              Request Type
            </p>

            <h2 className="text-xl font-bold">
              {order.request_type}
            </h2>

          </div>

          <div>

            <p className="text-gray-500">
              Grand Total
            </p>

            <h2 className="text-2xl font-bold text-green-700">
              SAR {Number(order.grand_total).toLocaleString()}
            </h2>

          </div>

        </div>

      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow">

        <table className="w-full">

          <thead className="bg-green-700 text-white">

            <tr>

              <th className="p-4 text-left">Item</th>
              <th className="p-4 text-left">Unit</th>
              <th className="p-4 text-center">Qty</th>
              <th className="p-4 text-right">Unit Cost</th>
              <th className="p-4 text-right">Total</th>

            </tr>

          </thead>

          <tbody>

            {items.map((item, index) => (

              <tr
                key={index}
                className="border-b"
              >

                <td className="p-4">
                  {item.item_name}
                </td>

                <td className="p-4">
                  {item.unit}
                </td>

                <td className="p-4 text-center">
                  {item.quantity}
                </td>

                <td className="p-4 text-right">
                  SAR {item.unit_cost}
                </td>

                <td className="p-4 text-right font-bold">
                  SAR {(item.quantity * item.unit_cost).toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </AppLayout>
  );
}