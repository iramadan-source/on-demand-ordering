"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

import OrderHeader from "./OrderHeader";
import ItemSearchModal from "./ItemSearchModal";
import OrderTable from "./OrderTable";
import OrderSummary from "./OrderSummary";

type Item = {
  name: string;
  unit: string;
  cost: number;
};

type Branch = {
  id: string;
  name: string;
};

type OrderItem = {
  item: Item;
  quantity: number;
};

type Props = {
  editMode?: boolean;
  orderId?: string;
};

export default function OrderForm({
  editMode = false,
  orderId,
}: Props) {

  const today =
    new Date().toISOString().split("T")[0];

  const [orderDate, setOrderDate] =
    useState(today);

  const [branch, setBranch] =
    useState("");

  const [requestType, setRequestType] =
    useState("Components");

  const [search, setSearch] =
    useState("");

  const [showSearch, setShowSearch] =
    useState(false);

  const [rows, setRows] =
    useState<OrderItem[]>([]);

  const [branches, setBranches] =
    useState<Branch[]>([]);

  const [components, setComponents] =
    useState<Item[]>([]);

  const [kitchenSupplies, setKitchenSupplies] =
    useState<Item[]>([]);

  useEffect(() => {

    loadBranches();

    loadComponents();

    loadKitchenSupplies();

  }, []);

  useEffect(() => {

    if (!orderId) return;

    loadOrder();

  }, [orderId]);

  async function loadBranches() {

    const { data, error } =
      await supabase
        .from("branches")
        .select("id,name")
        .eq("active", true)
        .order("name");

    if (error) {

      console.error(error);

      return;

    }

    setBranches(data || []);

  }

  async function loadComponents() {

    const { data, error } =
      await supabase
        .from("components")
        .select("name,unit,cost")
        .eq("active", true)
        .order("name");

    if (error) {

      console.error(error);

      return;

    }

    setComponents(data || []);

  }

  async function loadKitchenSupplies() {

    const { data, error } =
      await supabase
        .from("kitchen_supplies")
        .select("name,unit,cost")
        .eq("active", true)
        .order("name");

    if (error) {

      console.error(error);

      return;

    }

    setKitchenSupplies(data || []);

  }

    async function loadOrder() {

    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (!order) return;

    setOrderDate(order.order_date);
    setBranch(order.branch);
    setRequestType(order.request_type);

    const { data: orderItems } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    if (!orderItems) return;

    setRows(
      orderItems.map((item) => ({
        item: {
          name: item.item_name,
          unit: item.unit,
          cost: item.unit_cost,
        },
        quantity: item.quantity,
      }))
    );

  }

  const items =
    requestType === "Components"
      ? components
      : kitchenSupplies;

  const filteredItems = useMemo(() => {

    if (search === "") return items;

    return items.filter((item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [search, items]);

  function addItem(item: Item) {

  const existingIndex =
    rows.findIndex(
      (row) => row.item.name === item.name
    );

  if (existingIndex !== -1) {

    const copy = [...rows];

    copy[existingIndex].quantity += 1;

    setRows(copy);

  } else {

    setRows([
      ...rows,
      {
        item,
        quantity: 1,
      },
    ]);

  }

  setSearch("");

  setShowSearch(false);

}

  function removeRow(index: number) {

    const copy = [...rows];

    copy.splice(index, 1);

    setRows(copy);

  }

  function updateQuantity(
    index: number,
    quantity: number
  ) {

    const copy = [...rows];

    copy[index].quantity = quantity;

    setRows(copy);

  }

  const grandTotal = rows.reduce(
    (sum, row) =>
      sum + row.item.cost * row.quantity,
    0
  );

  async function saveOrder() {

    if (!branch) {
      alert("Please select a branch");
      return;
    }

    if (rows.length === 0) {
      alert("Please add at least one item");
      return;
    }

    if (editMode && orderId) {

      const { error } = await supabase
        .from("orders")
        .update({
          order_date: orderDate,
          branch,
          request_type: requestType,
          grand_total: grandTotal,
        })
        .eq("id", orderId);

      if (error) {
        alert(error.message);
        return;
      }

      await supabase
        .from("order_items")
        .delete()
        .eq("order_id", orderId);

      const updatedItems = rows.map((row) => ({
        order_id: orderId,
        item_name: row.item.name,
        unit: row.item.unit,
        quantity: row.quantity,
        unit_cost: row.item.cost,
        total_cost:
          row.item.cost * row.quantity,
      }));

      const { error: itemsError } =
        await supabase
          .from("order_items")
          .insert(updatedItems);

      if (itemsError) {
        alert(itemsError.message);
        return;
      }

      alert("✅ Order Updated Successfully");

      return;

    }

    const {
      data: order,
      error: orderError,
    } = await supabase
      .from("orders")
      .insert({
        order_date: orderDate,
        branch,
        request_type: requestType,
        grand_total: grandTotal,
      })
      .select()
      .single();

    if (orderError) {
      alert(orderError.message);
      return;
    }

    const orderItems = rows.map((row) => ({
      order_id: order.id,
      item_name: row.item.name,
      unit: row.item.unit,
      quantity: row.quantity,
      unit_cost: row.item.cost,
      total_cost:
        row.item.cost * row.quantity,
    }));

    const { error: itemsError } =
      await supabase
        .from("order_items")
        .insert(orderItems);

    if (itemsError) {
      alert(itemsError.message);
      return;
    }

    alert("✅ Order Saved Successfully");

    setRows([]);
    setBranch("");
    setOrderDate(today);
    setSearch("");
    setShowSearch(false);

  }

    return (

    <>

      <OrderHeader
        orderDate={orderDate}
        setOrderDate={setOrderDate}
        branch={branch}
        setBranch={setBranch}
        requestType={requestType}
        setRequestType={setRequestType}
        branches={branches}
      />

      <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold">

            {editMode
              ? "Edit Order"
              : "New Order"}

          </h2>

          <button
            onClick={() =>
              setShowSearch(true)
            }
            className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
          >
            + Add Item
          </button>

        </div>

      </div>

      <ItemSearchModal
        show={showSearch}
        search={search}
        setSearch={setSearch}
        items={filteredItems}
        addItem={addItem}
        onClose={() => {

          setShowSearch(false);

          setSearch("");

        }}
      />

      <OrderTable
        rows={rows}
        updateQuantity={updateQuantity}
        removeRow={removeRow}
      />

      <OrderSummary
        grandTotal={grandTotal}
        saveOrder={saveOrder}
      />

    </>

  );

}