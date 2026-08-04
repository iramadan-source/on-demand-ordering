"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { branches } from "@/data/branches";
import { supabase } from "@/lib/supabase";

type Order = {
  branch: string;
  request_type: string;
};

export default function BranchStatusPage() {
  const [componentBranches, setComponentBranches] = useState<string[]>([]);
  const [kitchenBranches, setKitchenBranches] = useState<string[]>([]);

  useEffect(() => {
    loadStatus();

    const interval = setInterval(loadStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  async function loadStatus() {
    const { data, error } = await supabase
      .from("orders")
      .select("branch,request_type");

    if (error) {
      console.error(error);
      return;
    }

    setComponentBranches(
      [
        ...new Set(
          data
            .filter(
              (o) => o.request_type === "Components"
            )
            .map((o) => o.branch)
        ),
      ]
    );

    setKitchenBranches(
      [
        ...new Set(
          data
            .filter(
              (o) =>
                o.request_type ===
                "Kitchen Supplies"
            )
            .map((o) => o.branch)
        ),
      ]
    );
  }

  return (
    <AppLayout>

      <h1 className="mb-8 text-5xl font-bold">
        Branch Status
      </h1>

      <div className="overflow-hidden rounded-2xl bg-white shadow">

        <table className="w-full">

          <thead className="bg-green-700 text-white">

            <tr>

              <th className="p-5 text-left">
                Branch
              </th>

              <th className="p-5 text-center">
                Components
              </th>

              <th className="p-5 text-center">
                Kitchen Supplies
              </th>

            </tr>

          </thead>

          <tbody>

            {branches.map((branch) => {

              const componentSubmitted =
                componentBranches.includes(branch);

              const kitchenSubmitted =
                kitchenBranches.includes(branch);

              return (

                <tr
                  key={branch}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-5 font-semibold">
                    {branch}
                  </td>

                  <td className="text-center">

                    {componentSubmitted ? (
                      <span className="font-bold text-green-600">
                        🟢 Submitted
                      </span>
                    ) : (
                      <span className="font-bold text-red-600">
                        🔴 Pending
                      </span>
                    )}

                  </td>

                  <td className="text-center">

                    {kitchenSubmitted ? (
                      <span className="font-bold text-green-600">
                        🟢 Submitted
                      </span>
                    ) : (
                      <span className="font-bold text-red-600">
                        🔴 Pending
                      </span>
                    )}

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

    </AppLayout>
  );
}