"use client";

import { useState } from "react";

type Props = {
  onSuccess: () => void;
};

const ADMIN_PASSWORD = "Calo@2026";

export default function AdminLogin({
  onSuccess,
}: Props) {

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function login() {

    if (password === ADMIN_PASSWORD) {

      sessionStorage.setItem(
        "admin-auth",
        "true"
      );

      onSuccess();

      return;

    }

    setError("Incorrect Password");

  }

  return (

    <div className="flex min-h-screen items-center justify-center bg-gray-100">

      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl">

        <h1 className="mb-2 text-center text-4xl font-bold text-green-700">
          🔒 Admin Access
        </h1>

        <p className="mb-8 text-center text-gray-500">
          Enter the administrator password
        </p>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") login();
          }}
          className="w-full rounded-xl border p-4 text-lg"
        />

        {error && (

          <p className="mt-3 text-center text-red-600">
            {error}
          </p>

        )}

        <button
          onClick={login}
          className="mt-6 w-full rounded-xl bg-green-700 py-4 text-lg font-bold text-white hover:bg-green-800"
        >
          Login
        </button>

      </div>

    </div>

  );

}