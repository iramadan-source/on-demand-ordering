"use client";

import AppLayout from "@/components/AppLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Branch = {
  id: string;
  name: string;
  active: boolean;
};

export default function BranchSettingsPage() {

  const [branches, setBranches] =
  useState<Branch[]>([]);

  const [loading, setLoading] =
  useState(true);
  const [showEdit, setShowEdit] =
  useState(false);

const [isNew, setIsNew] =
  useState(false);

const [selected, setSelected] =
  useState<Branch | null>(null);

const [editName, setEditName] =
  useState("");

  useEffect(() => {

  loadBranches();

}, []);

async function loadBranches() {

  setLoading(true);

  const { data, error } =
    await supabase
      .from("branches")
      .select("*")
      .order("name");

  if (error) {

    console.error(error);

  } else {

    setBranches(data || []);

  }

  setLoading(false);

}
async function saveBranch() {

  if (isNew) {

    const { error } =
      await supabase
        .from("branches")
        .insert({
          name: editName,
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
        .from("branches")
        .update({
          name: editName,
        })
        .eq("id", selected.id);

    if (error) {

      alert(error.message);

      return;

    }

  }

  setShowEdit(false);

  setEditName("");

  setSelected(null);

  loadBranches();

}

async function toggleBranch(branch: Branch) {

  const { error } =
    await supabase
      .from("branches")
      .update({
        active: !branch.active,
      })
      .eq("id", branch.id);

  if (error) {

    alert(error.message);

    return;

  }

  loadBranches();

}
  return (

    <AppLayout>

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-5xl font-bold">
            Branches
          </h1>

          <p className="mt-2 text-gray-500">
            Manage all company branches
          </p>

        </div>

        <button
  onClick={() => {

    setIsNew(true);

    setSelected(null);

    setEditName("");

    setShowEdit(true);

  }}
  className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
>
  + Add Branch
</button>

      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow">

        <table className="w-full">

          <thead className="bg-green-700 text-white">

            <tr>

              <th className="p-4 text-left">
                Branch Name
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
      colSpan={3}
      className="p-8 text-center"
    >
      Loading...
    </td>

  </tr>

) : (

  branches.map((branch) => (

    <tr
      key={branch.id}
      className="border-b hover:bg-gray-50"
    >

      <td className="p-4 font-medium">
        {branch.name}
      </td>

      <td className="p-4 text-center">

        <span
  className={`rounded-full px-4 py-2 text-sm font-semibold ${
    branch.active
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"
  }`}
>
  {branch.active ? "Active" : "Inactive"}
</span>

      </td>

      <td className="p-4">

        <div className="flex justify-center gap-3">

          <button
  onClick={() => {

    setIsNew(false);

    setSelected(branch);

    setEditName(branch.name);

    setShowEdit(true);

  }}
  className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
>
  Edit
</button>

          <button
  onClick={() => toggleBranch(branch)}
  className={`rounded-lg px-4 py-2 text-white ${
    branch.active
      ? "bg-red-600 hover:bg-red-700"
      : "bg-green-700 hover:bg-green-800"
  }`}
>
  {branch.active
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

    <div className="w-[450px] rounded-2xl bg-white p-8 shadow-xl">

      <h2 className="mb-6 text-3xl font-bold">

        {isNew
          ? "Add Branch"
          : "Edit Branch"}

      </h2>

      <input
        value={editName}
        onChange={(e) => setEditName(e.target.value)}
        className="w-full rounded-lg border p-3"
        placeholder="Branch Name"
      />

      <div className="mt-8 flex justify-end gap-3">

        <button
          onClick={() => setShowEdit(false)}
          className="rounded-lg border px-5 py-3"
        >
          Cancel
        </button>

        <button
  onClick={saveBranch}
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