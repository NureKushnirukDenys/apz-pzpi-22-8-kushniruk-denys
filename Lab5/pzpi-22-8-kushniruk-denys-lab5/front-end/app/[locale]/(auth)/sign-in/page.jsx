"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

const SignIn = () => {
  const t = useTranslations("SingIn");
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Помилка входу");
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/"); // редірект на головну
      setSuccess("Вхід успішний!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-[#0e0e0e] dark:to-[#232a36] flex flex-col">
      <Header />
      <div className="flex flex-1 items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-[#1f293b] rounded-lg shadow-lg p-8 w-full max-w-sm space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
            {t("title")}
          </h2>
          {error && <div className="text-red-500 text-center">{error}</div>}
          {success && (
            <div className="text-green-500 text-center">{success}</div>
          )}
          <div>
            <label
              className="block text-gray-700 dark:text-gray-300 mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#181c24] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Email"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 dark:text-gray-300 mb-1"
              htmlFor="password"
            >
              {t("password")}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#181c24] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={t("password")}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            {t("title")}
          </button>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            {t("noAccount")}
            <Link
              href="/sign-up"
              className="text-blue-600 hover:underline ml-2"
            >
              {t("signUp")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
