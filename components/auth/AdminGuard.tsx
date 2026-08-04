"use client";

import { useEffect, useState } from "react";
import AdminLogin from "./AdminLogin";

type Props = {
  children: React.ReactNode;
};

export default function AdminGuard({
  children,
}: Props) {

  const [authorized, setAuthorized] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const access =
      sessionStorage.getItem("admin-auth");

    if (access === "true") {

      setAuthorized(true);

    }

    setLoading(false);

  }, []);

  if (loading) {

    return (
      <div className="flex h-screen items-center justify-center">

        <h1 className="text-2xl font-bold">
          Loading...
        </h1>

      </div>
    );

  }

  if (!authorized) {

    return (

      <AdminLogin
        onSuccess={() =>
          setAuthorized(true)
        }
      />

    );

  }

  return <>{children}</>;

}