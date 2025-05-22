"use client";

import Header from "@/components/Header";
import LogCard from "@/components/LogCard";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const t = useTranslations("Logs");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("http://localhost:5000/logs/info");
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      } catch {
        setLogs([]);
      }
      setLoading(false);
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const searchStr = search.toLowerCase();
    return (
      log.action?.toLowerCase().includes(searchStr) ||
      // room_id може бути рядком або об'єктом (і не null)
      (typeof log.room_id === "string"
        ? log.room_id.toLowerCase().includes(searchStr)
        : log.room_id &&
          typeof log.room_id === "object" &&
          (log.room_id._id?.toLowerCase().includes(searchStr) ||
            log.room_id.name?.toLowerCase().includes(searchStr))) ||
      // user_id може бути рядком або об'єктом (і не null)
      (typeof log.user_id === "string"
        ? log.user_id.toLowerCase().includes(searchStr)
        : log.user_id &&
          typeof log.user_id === "object" &&
          (log.user_id._id?.toLowerCase().includes(searchStr) ||
            log.user_id.email?.toLowerCase().includes(searchStr) ||
            log.user_id.firstName?.toLowerCase().includes(searchStr) ||
            log.user_id.lastName?.toLowerCase().includes(searchStr)))
    );
  });

  return (
    <>
      <Header />
      <div className="min-h-screen pt-8 px-2 mt-[-75px] max-w-[95%] mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-white mt-28">
          {t("title")}
        </h2>
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 px-4 py-2 rounded border border-[#353535] bg-[#181818] text-white w-full max-w-xl mx-auto block"
        />
        {loading ? (
          <div className="text-center text-white">{t("loading")}</div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center text-[#bdbdbd]">{t("notFound")}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
            {filteredLogs.map((log) => (
              <LogCard key={log._id} log={log} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default LogsPage;
