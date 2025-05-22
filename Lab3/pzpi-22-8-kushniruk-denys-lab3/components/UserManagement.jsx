"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/users";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const t = useTranslations("UserManagement");

  useEffect(() => {
    // Зчитуємо поточного користувача з localStorage
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData && userData !== "undefined") {
        try {
          setCurrentUser(JSON.parse(userData));
        } catch {
          setCurrentUser(null);
        }
      }
    }
  }, []);

  // Завантаження користувачів
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Помилка завантаження користувачів");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Не вдалося отримати користувачів. Перевірте сервер і CORS.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Пошук
  const filteredUsers = users.filter(
    (u) =>
      u._id.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase())
  );

  // Зміна ролі
  const handleRoleChange = async (id, newRole) => {
    if (
      !currentUser ||
      (currentUser.role !== "admin" && currentUser.role !== "superadmin")
    )
      return;
    await fetch(`${API_URL}/role/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    fetchUsers();
  };

  const isAdmin =
    currentUser &&
    (currentUser.role === "admin" || currentUser.role === "superadmin");

  return (
    <div className="p-6 max-w-7xl w-full mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">{t("title")}</h2>
      <input
        type="text"
        placeholder={t("searchPlaceholder")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-3 py-2 border border-[#252525] rounded w-full"
      />
      {error && <div className="text-red-500 mb-2">{t("error")}</div>}
      {loading ? (
        <div>{t("loading")}</div>
      ) : (
        <table className="w-full border border-[#252525] text-lg">
          <thead>
            <tr className="bg-[#121212]">
              <th className="p-1 border border-[#252525] text-center">ID</th>
              <th className="p-1 border border-[#252525] text-center">
                {t("avatar")}
              </th>
              <th className="p-1 border border-[#252525]">{t("email")}</th>
              <th className="p-1 border border-[#252525]">{t("firstName")}</th>
              <th className="p-1 border border-[#252525]">{t("lastName")}</th>
              <th className="p-1 border border-[#252525]">{t("role")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td className="p-1 border border-[#252525] text-center">
                  {user._id}
                </td>
                <td className="p-1 w-12 border border-[#252525] text-center">
                  <Image
                    src={user.profileImage}
                    alt="avatar"
                    width={28}
                    height={28}
                    className="mx-auto w-7 h-7 rounded-full object-cover"
                  />
                </td>
                <td className="p-1 border border-[#252525]">{user.email}</td>
                <td className="p-1 border border-[#252525]">
                  {user.firstName}
                </td>
                <td className="p-1 border border-[#252525]">{user.lastName}</td>
                <td className="p-1 w-24 border border-[#252525] text-center">
                  {isAdmin ? (
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="border border-[#252525] rounded px-2 py-1"
                      disabled={
                        currentUser.role === "admin" &&
                        (user.role === "admin" || user.role === "superadmin")
                      }
                    >
                      <option className="bg-[#252525]" value="user">
                        user
                      </option>
                      <option className="bg-[#252525]" value="admin">
                        admin
                      </option>
                      <option className="bg-[#252525]" value="superadmin">
                        superadmin
                      </option>
                    </select>
                  ) : (
                    <span className="capitalize">{user.role}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;
