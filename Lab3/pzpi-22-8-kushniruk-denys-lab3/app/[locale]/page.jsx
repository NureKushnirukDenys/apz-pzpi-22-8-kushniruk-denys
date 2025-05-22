"use client";

import Header from "@/components/Header";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    users: 0,
    rooms: 0,
    logs: 0,
  });
  const [backupStatus, setBackupStatus] = useState("");
  const [recentLogs, setRecentLogs] = useState([]);
  const t = useTranslations("Dashboard");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData && userData !== "undefined") {
        try {
          setUser(JSON.parse(userData));
        } catch {
          setUser(null);
        }
      }
    }
  }, []);

  useEffect(() => {
    // Отримання статистики з бекенду
    const fetchStats = async () => {
      try {
        // Користувачі
        const usersRes = await fetch("http://localhost:5000/users");
        const users = await usersRes.json();

        // Кімнати
        const roomsRes = await fetch("http://localhost:5000/rooms");
        const rooms = await roomsRes.json();

        // Логи
        const logsRes = await fetch("http://localhost:5000/logs/info");
        const logs = await logsRes.json();

        setStats({
          users: Array.isArray(users) ? users.length : 0,
          rooms: Array.isArray(rooms) ? rooms.length : 0,
          logs: Array.isArray(logs) ? logs.length : 0,
        });

        setRecentLogs(Array.isArray(logs) ? logs.slice(-5).reverse() : []);
      } catch {
        setStats({ users: 0, rooms: 0, logs: 0 });
        setRecentLogs([]);
      }
    };
    fetchStats();
  }, []);

  const handleBackup = async () => {
    setBackupStatus("Виконується бекап...");
    try {
      // Отримати user_id з localStorage
      const userData = localStorage.getItem("user");
      const user_id = userData ? JSON.parse(userData).id : null;

      const res = await fetch("http://localhost:5000/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id }),
      });
      const data = await res.json();
      if (res.ok) {
        setBackupStatus("Бекап виконано успішно!");
      } else {
        setBackupStatus("Помилка: " + (data.message || "невідома"));
      }
    } catch (e) {
      setBackupStatus("Помилка при з'єднанні з сервером");
    }
    setTimeout(() => setBackupStatus(""), 4000);
  };

  return (
    <main>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen text-white mt-[-75px]">
        <div className="w-full max-w-3xl">
          <div className="text-5xl text-center mb-4">{t("adminPanel")}</div>
          <div className="text-xl text-center mb-8">{t("system")}</div>
          {user && (
            <div className="bg-[#232323] rounded-lg p-4 mb-6 text-center shadow">
              <div className="text-xl font-semibold mb-1">
                {t("greeting", {
                  firstName: user.firstName,
                  lastName: user.lastName,
                })}
              </div>
              <div className="text-sm text-[#bdbdbd]">
                {t("role")} <span className="font-bold">{user.role}</span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-[#232323] rounded-lg p-6 text-center shadow">
              <div className="text-3xl font-bold">{stats.users}</div>
              <div className="text-sm mt-2">{t("users")}</div>
            </div>
            <div className="bg-[#232323] rounded-lg p-6 text-center shadow">
              <div className="text-3xl font-bold">{stats.rooms}</div>
              <div className="text-sm mt-2">{t("rooms")}</div>
            </div>
            <div className="bg-[#232323] rounded-lg p-6 text-center shadow">
              <div className="text-3xl font-bold">{stats.logs}</div>
              <div className="text-sm mt-2">{t("logs")}</div>
            </div>
          </div>
          <div className="bg-[#232323] rounded-lg p-6 shadow">
            <div className="text-lg font-semibold mb-2">{t("lastActions")}</div>
            <ul className="text-sm text-[#bdbdbd] list-disc pl-5">
              {recentLogs.length === 0 ? (
                <li>{t("noActions")}</li>
              ) : (
                recentLogs.map((log) => <li key={log._id}>{log.action}</li>)
              )}
            </ul>
          </div>
          <button
            onClick={handleBackup}
            className="w-full px-5 py-3 my-6 bg-[#232323] hover:bg-[#353535] rounded text-white font-semibold transition text-lg"
          >
            {t("backup")}
          </button>
          {backupStatus && (
            <div className="mb-6 text-center text-lg text-[#bdbdbd]">
              {backupStatus === "Виконується бекап..."
                ? t("backupInProgress")
                : backupStatus === "Бекап виконано успішно!"
                ? t("backupSuccess")
                : backupStatus.startsWith("Помилка:")
                ? t("backupError", {
                    error: backupStatus.replace("Помилка: ", ""),
                  })
                : backupStatus === "Помилка при з'єднанні з сервером"
                ? t("backupConnectionError")
                : backupStatus}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
