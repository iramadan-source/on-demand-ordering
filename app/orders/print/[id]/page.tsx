"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
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

  const [order, setOrder] =
    useState<Order | null>(null);

  const [items, setItems] =
    useState<OrderItem[]>([]);

  useEffect(() => {

    loadOrder();

  }, []);

  async function loadOrder() {

    const { data: orderData } =
      await supabase
        .from("orders")
        .select("*")
        .eq("id", params.id)
        .single();

    setOrder(orderData);

    const { data: itemData } =
      await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", params.id);

    setItems(itemData || []);

  }

  if (!order) {

    return (
      <div className="flex min-h-screen items-center justify-center text-2xl font-bold">
        Loading...
      </div>
    );

  }

  const formattedDate =
    new Date(order.order_date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  return (

    <div className="mx-auto bg-white px-8 py-8 text-black max-w-[190mm] min-h-screen">

      {/* HEADER */}

      <div className="relative border-b-[3px] border-green-700 pb-8">

        <button
          onClick={() => window.print()}
          className="absolute right-0 top-0 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800 print:hidden"
        >
          Print
        </button>

        <div className="text-center">

          <Image
            src="/logo.png"
            alt="CALO"
            width={280}
            height={90}
            className="mx-auto h-auto"
            priority
          />

          <h1 className="mt-4 text-4xl font-extrabold uppercase tracking-[0.2em] text-green-700">

            {order.request_type === "Components"
              ? "Component Request"
              : "Kitchen Supplies Request"}

          </h1>

          <p className="mt-2 text-lg text-gray-500">
            On Demand Ordering
          </p>

        </div>

      </div>

            {/* ORDER INFORMATION */}

      <div className="mt-8 rounded-xl border border-gray-300 bg-gray-50 p-5">

        <h2 className="mb-4 border-b border-green-700 pb-2 text-lg font-bold uppercase text-green-700">
          Order Information
        </h2>

        <div className="grid grid-cols-3 gap-8">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Date
            </p>

            <p className="mt-2 text-2xl font-bold">
              {formattedDate}
            </p>

          </div>

          <div>

            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Branch
            </p>

            <p className="mt-2 text-2xl font-bold">
              {order.branch}
            </p>

          </div>

          <div>

            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Request Type
            </p>

            <p className="mt-2 text-2xl font-bold">
              {order.request_type}
            </p>

          </div>

        </div>

      </div>

      {/* ITEMS */}

      <div className="mt-8 overflow-hidden rounded-xl border border-gray-300">

        <table className="w-full border-collapse">

          <thead>

            <tr className="bg-green-700 text-white">

              <th className="w-[8%] border border-green-800 py-4 text-center">
                #
              </th>

              <th className="w-[62%] border border-green-800 px-5 py-4 text-left">
                Description
              </th>

              <th className="w-[15%] border border-green-800 py-4 text-center">
                Unit
              </th>

              <th className="w-[15%] border border-green-800 py-4 text-center">
                Quantity
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

                <td className="border py-5 text-center font-semibold">
                  {index + 1}
                </td>

                <td className="border px-5 py-5 font-medium">
                  {item.item_name}
                </td>

                <td className="border py-5 text-center">
                  {item.unit}
                </td>

                <td className="border py-5 text-center text-2xl font-bold">
                  {item.quantity}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

            {/* FOOTER */}

      <div className="mt-8 flex items-center justify-between border-t border-gray-300 pt-4 text-sm text-gray-600">

        <div>
          Printed:{" "}
          {new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}{" "}
          •{" "}
          {new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        <div>
          Page 1 of 1
        </div>

      </div>

      <style jsx global>{`

        @page {
          size: A4 portrait;
          margin: 10mm;
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

          table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: auto;
          }

          thead {
            display: table-header-group;
          }

          tbody {
            display: table-row-group;
          }

          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }

          td,
          th {
            border: 1px solid #cfcfcf;
          }

        }

      `}</style>

    </div>

  );

}