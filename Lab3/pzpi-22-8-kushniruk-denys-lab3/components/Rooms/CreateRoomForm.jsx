"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";

const API_URL = "http://localhost:5000/rooms/create";

const CreateRoomForm = ({ onRoomCreated }) => {
  const [name, setName] = useState("");
  const [iotDeviceId, setIotDeviceId] = useState("");
  const [distance, setDistance] = useState("");
  const [brightness, setBrightness] = useState(100);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Rooms");

  // Отримати user_id з localStorage
  const userData =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user_id = userData ? JSON.parse(userData).id : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name || !iotDeviceId) {
      setError(t("allFieldsRequired"));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          name,
          iotDeviceId,
          distance: distance ? Number(distance) : undefined,
          brightness: Number(brightness),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || t("createError"));
      setName("");
      setIotDeviceId("");
      setDistance("");
      setBrightness(100);
      if (onRoomCreated) onRoomCreated(data.room);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#232323] rounded-lg p-6 shadow max-w-lg w-80 mx-auto flex flex-col gap-4"
    >
      <div className="text-lg font-semibold text-white mb-2">
        {t("createRoom")}
      </div>
      <input
        type="text"
        placeholder={t("roomName")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-3 py-2 rounded border border-[#353535] bg-[#181818] text-white"
        required
      />
      <input
        type="text"
        placeholder="IoT ID"
        value={iotDeviceId}
        onChange={(e) => setIotDeviceId(e.target.value)}
        className="px-3 py-2 rounded border border-[#353535] bg-[#181818] text-white"
        required
      />
      <input
        type="number"
        placeholder={t("distance")}
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        className="px-3 py-2 rounded border border-[#353535] bg-[#181818] text-white"
        min={0}
      />
      <label className="text-white flex flex-col gap-1">
        {t("brightness")}
        <input
          type="number"
          min={0}
          max={100}
          value={brightness}
          onChange={(e) => setBrightness(e.target.value)}
          className="px-3 py-2 rounded border border-[#353535] bg-[#181818] text-white"
        />
      </label>
      {error && <div className="text-red-500">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded px-4 py-2 transition"
      >
        {loading ? t("creating") : t("create")}
      </button>
    </form>
  );
};

export default CreateRoomForm;
