"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";

type ComponentItem = {
  id: string;
  name: string;
  unit: string;
  cost: number;
  active: boolean;
};

export default function ComponentsPage() {

  const [components, setComponents] =
    useState<ComponentItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");
    const [showEdit, setShowEdit] =
  useState(false);
  const [isNew, setIsNew] =
  useState(false);

const [selected, setSelected] =
  useState<ComponentItem | null>(null);

const [editName, setEditName] =
  useState("");

const [editUnit, setEditUnit] =
  useState("");

const [editCost, setEditCost] =
  useState("");

  useEffect(() => {

    loadComponents();

  }, []);

  async function loadComponents() {

    setLoading(true);

    const { data, error } =
      await supabase
        .from("components")
        .select("*")
        .order("name");

    if (error) {

      console.error(error);

    } else {

      setComponents(data || []);

    }

    setLoading(false);

  }
  async function saveComponent() {

  if (isNew) {

    const { error } =
      await supabase
        .from("components")
        .insert({
          name: editName,
          unit: editUnit,
          cost: Number(editCost),
          active: true,
        });

    if (error) {

      alert(error.message);

      return;

    }
    

  } else {

    if (!selected) return;

    const { error } =
      await supabase
        .from("components")
        .update({
          name: editName,
          unit: editUnit,
          cost: Number(editCost),
        })
        .eq("id", selected.id);

    if (error) {

      alert(error.message);

      return;

    }

  }

  setShowEdit(false);

  loadComponents();

}

async function toggleComponent(item: ComponentItem) {

  const { error } =
    await supabase
      .from("components")
      .update({
        active: !item.active,
      })
      .eq("id", item.id);

  if (error) {

    alert(error.message);

    return;

  }

  loadComponents();

}
  const filtered =
    components.filter((item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (

    <AppLayout>

      <div className="mb-8 flex items-center justify-between">

  <div>

    <h1 className="text-5xl font-bold">
      Components
    </h1>

    <p className="mt-2 text-gray-500">
      Manage kitchen components
    </p>

  </div>

  <button
  onClick={() => {

    setIsNew(true);

    setSelected(null);

    setEditName("");

    setEditUnit("");

    setEditCost("");

    setShowEdit(true);

  }}
  className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
>
  + Add Component
</button>

</div>

      <div className="mb-6 rounded-2xl bg-white p-6 shadow">

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search component..."
          className="w-full rounded-xl border p-4"
        />

      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow">

        <table className="w-full">

          <thead className="bg-green-700 text-white">

            <tr>

              <th className="p-4 text-left">
                Component
              </th>

              <th className="p-4 text-center">
                Unit
              </th>

              <th className="p-4 text-right">
                Cost
              </th>

              <th className="p-4 text-center">
                Status
              </th>
              <th className="p-4 text-center">
  Actions
</th>

            </tr>

          </thead>

<tbody>

  {loading ? (

    <tr>

      <td
        colSpan={4}
        className="p-8 text-center"
      >
        Loading...
      </td>

    </tr>

  ) : filtered.length === 0 ? (

    <tr>

      <td
        colSpan={4}
        className="p-8 text-center text-gray-500"
      >
        No Components Found
      </td>

    </tr>

  ) : (

    filtered.map((item) => (

      <tr
        key={item.id}
        className="border-b hover:bg-gray-50"
      >

        <td className="p-4 font-medium">
          {item.name}
        </td>

        <td className="p-4 text-center">
          {item.unit}
        </td>

        <td className="p-4 text-right font-bold text-green-700">
          SAR {Number(item.cost).toFixed(6)}
        </td>

        <td className="p-4 text-center">

          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              item.active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {item.active
              ? "Active"
              : "Inactive"}
          </span>

        </td>

<td className="p-4">

  <div className="flex justify-center gap-2">

    <button
      onClick={() => {

        setIsNew(false);

        setSelected(item);

        setEditName(item.name);

        setEditUnit(item.unit);

        setEditCost(String(item.cost));

        setShowEdit(true);

      }}
      className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
    >
      Edit
    </button>

    <button
      onClick={() => toggleComponent(item)}
      className={`rounded-lg px-4 py-2 text-white ${
        item.active
          ? "bg-red-600 hover:bg-red-700"
          : "bg-green-700 hover:bg-green-800"
      }`}
    >
      {item.active
        ? "Deactivate"
        : "Activate"}
    </button>

  </div>

</td>

</tr>

    ))

  )}

</tbody>
        </table>

      </div>
              {showEdit && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

    <div className="w-[500px] rounded-2xl bg-white p-8 shadow-xl">

      <h2 className="mb-6 text-3xl font-bold">

  {isNew
    ? "Add Component"
    : "Edit Component"}

</h2>

      <div className="space-y-5">

        <input
          value={editName}
          onChange={(e) =>
            setEditName(e.target.value)
          }
          className="w-full rounded-lg border p-3"
          placeholder="Name"
        />

        <input
          value={editUnit}
          onChange={(e) =>
            setEditUnit(e.target.value)
          }
          className="w-full rounded-lg border p-3"
          placeholder="Unit"
        />

        <input
          value={editCost}
          onChange={(e) =>
            setEditCost(e.target.value)
          }
          className="w-full rounded-lg border p-3"
          placeholder="Cost"
        />

      </div>

      <div className="mt-8 flex justify-end gap-3">

        <button
          onClick={() =>
            setShowEdit(false)
          }
          className="rounded-lg border px-5 py-3"
        >
          Cancel
        </button>

        <button
  onClick={saveComponent}
  className="rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
>
  Save
</button>

      </div>

    </div>

  </div>

)}
              </AppLayout>

  );

}
      