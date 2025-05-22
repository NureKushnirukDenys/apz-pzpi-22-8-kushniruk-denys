'use client";';

import { useTranslations } from "next-intl";
import React, { useState } from "react";

const API_URL = "http://localhost:5000/rooms";

const EditRoomForm = ({ room, onClose, onRoomUpdated }) => {
  const [name, setName] = useState(room.name);
  const [iotDeviceId, setIotDeviceId] = useState(room.iotDeviceId);
  const [distance, setDistance] = useState(room.distance ?? "");
  const [brightness, setBrightness] = useState(room.brightness ?? 100);
  const [status, setStatus] = useState(room.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = useTranslations("Rooms");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/${room._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          iotDeviceId,
          distance: distance ? Number(distance) : 0,
          status,
          brightness: Number(brightness),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Помилка оновлення кімнати");
      if (onRoomUpdated) onRoomUpdated(data.room);
      onClose();
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
        {t("editRoom")}
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
      <label className="flex items-center gap-3 text-white">
        <button
          type="button"
          onClick={() => setStatus((prev) => !prev)}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200
      ${status ? "bg-green-500" : "bg-gray-400"}`}
          aria-pressed={status}
        >
          <span
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200
        ${status ? "translate-x-6" : "translate-x-0"}`}
          />
        </button>
        <span className={status ? "text-green-400" : "text-red-400"}>
          {status ? t("lightOn") : t("lightOff")}
        </span>
      </label>
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded px-4 py-2 transition"
        >
          {loading ? "Збереження..." : "Зберегти"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded px-4 py-2 transition"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
};

export default EditRoomForm;
