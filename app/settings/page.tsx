"use client";

import AppLayout from "@/components/AppLayout";
import Link from "next/link";

export default function SettingsPage() {

  const cards = [
    {
      title: "Branches",
      description: "Manage company branches",
      href: "/settings/branches",
    },
    {
      title: "Components",
      description: "Manage kitchen components",
      href: "/settings/components",
    },
    {
      title: "Kitchen Supplies",
      description: "Manage kitchen supplies",
      href: "/settings/kitchen-supplies",
    },
    {
      title: "Users",
      description: "Manage application users",
      href: "/settings/users",
    },
    {
      title: "System",
      description: "Application settings",
      href: "/settings/system",
    },
  ];

  return (
    <AppLayout>
      <h1 className="mb-8 text-5xl font-bold">
        Settings
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {cards.map((card) => (

          <Link
            key={card.title}
            href={card.href}
          >

            <div className="rounded-2xl bg-white p-8 shadow transition hover:-translate-y-1 hover:shadow-xl cursor-pointer">

              <h2 className="text-2xl font-bold">
                {card.title}
              </h2>

              <p className="mt-3 text-gray-500">
                {card.description}
              </p>

            </div>

          </Link>

        ))}

      </div>

    </AppLayout>
  );
}