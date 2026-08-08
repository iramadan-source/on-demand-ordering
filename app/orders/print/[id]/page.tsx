"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  order_date: string;
  branch: string;
  request_type: string;
};

type OrderItem = {
  item_name: string;
  unit: string;
  quantity: number;
};

export default function PrintOrderPage() {
  const params = useParams();

  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);

  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    loadOrder();
  }, []);

  async function loadOrder() {
    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (!orderData) return;

    setOrder(orderData);

    const { data: itemData } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id);

    setItems(itemData || []);
  }

  if (!order)
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );

  const formattedDate = new Date(
    order.order_date
  ).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
  <div className="print-order-container w-full max-w-5xl mx-auto">

    {/* HEADER */}

      <div className="border-b-2 border-green-700 pb-4">

        <button
          onClick={() => window.print()}
          className="absolute right-10 rounded-lg bg-green-700 px-5 py-1.5 text-white print:hidden"
        >
          Print
        </button>

        <div className="text-center">

          <Image
            src="/logo.png"
            alt="CALO"
            width={120}
            height={40}
            className="mx-auto"
            priority
          />

          <h1 className="mt-1 text-xl font-bold uppercase tracking-[0.15em] text-green-700">
            {order.request_type === "Components"
              ? "Component Request"
              : "Kitchen Supplies Request"}
          </h1>

          <p className="text-xs text-gray-500">
            On Demand Ordering
          </p>

        </div>

      </div>

      {/* ORDER INFO */}

      <div className="mt-2 rounded border border-gray-300 bg-gray-50 px-3 py-2">

  <div className="grid grid-cols-3 gap-4 text-xs">

    <div>
      <span className="font-semibold text-gray-500">
        Date
      </span>
      <div className="font-bold text-sm">
        {formattedDate}
      </div>
    </div>

    <div>
      <span className="font-semibold text-gray-500">
        Branch
      </span>
      <div className="font-bold text-sm">
        {order.branch}
      </div>
    </div>

    <div>
      <span className="font-semibold text-gray-500">
        Type
      </span>
      <div className="font-bold text-sm">
        {order.request_type}
      </div>
    </div>

  </div>

</div>

      {/* TABLE */}

      <div className="mt-2 overflow-hidden rounded-lg border border-gray-300">

        <table className="w-full border-collapse">

          <thead>

            <tr className="bg-green-700 text-sm text-white">

              <th className="border py-1.5 w-[8%]">#</th>

              <th className="border px-3 py-1.5 text-left w-[62%]">
                Description
              </th>

              <th className="border py-1.5 w-[15%]">
                Unit
              </th>

              <th className="border py-1.5 w-[15%]">
                Qty
              </th>

            </tr>

          </thead>

          <tbody>

            {items.map((item, index) => (

              <tr
                key={index}
                className={
                  index % 2 === 0
                    ? "bg-white"
                    : "bg-green-50"
                }
              >

                <td className="border py-1.5 text-center">
                  {index + 1}
                </td>

                <td className="border px-3 py-1.5">
                  {item.item_name}
                </td>

                <td className="border py-1.5 text-center">
                  {item.unit}
                </td>

                <td className="border py-1.5 text-center font-bold">
                  {item.quantity}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

            {/* FOOTER */}

      <div className="mt-2 flex items-center justify-between border-t border-gray-300 pt-2 text-xs text-gray-600">

        <div>
          Printed{" "}
          {new Date().toLocaleDateString("en-GB")}{" "}
          {new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        <div>
          Page 1
        </div>

      </div>

      <style jsx global>{`

        @page {
  size: A4 portrait;
  margin: 5mm;
}

        @media print {

          html,
          body {
            background: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          button {
            display: none !important;
          }
            .print-order-container {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
}

          table {
            width: 100%;
            border-collapse: collapse;
          }

          thead {
            display: table-header-group;
          }

          tr {
            page-break-inside: avoid;
          }

        }

      `}</style>

    </div>

  );

}