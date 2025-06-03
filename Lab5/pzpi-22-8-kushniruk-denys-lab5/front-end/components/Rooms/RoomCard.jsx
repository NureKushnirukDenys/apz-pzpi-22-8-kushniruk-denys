"use client";

import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { useTranslations } from "next-intl";

const RoomCard = ({ room, onEdit, onDelete }) => {
  const [saving, setSaving] = useState(null);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Rooms");

  const handleCalculateSaving = async () => {
    setLoading(true);
    setSaving(null);
    try {
      const res = await fetch(`http://localhost:5000/rooms/saving/${room._id}`);
      const data = await res.json();
      if (res.ok) {
        setSaving(data.savingPercent);
      } else {
        setSaving(t("error") || "Помилка");
      }
    } catch {
      setSaving(t("error") || "Помилка");
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#232323] rounded-lg shadow p-6 flex flex-col gap-2 min-w-[220px] transition-transform duration-200 hover:scale-105 hover:shadow-lg hover:bg-[#282828] cursor-pointer relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(room);
        }}
        className="absolute top-4 right-10 text-white hover:text-blue-400 p-1 rounded-full transition"
        title={t("editRoom")}
      >
        <MdEdit size={20} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(room);
        }}
        className="absolute top-4 right-2 text-white hover:text-red-400 p-1 rounded-full transition"
        title={t("delete")}
      >
        <FaRegTrashAlt size={18} />
      </button>
      <div className="text-xl font-bold">{room.name}</div>
      <div className="text-sm text-[#bdbdbd]">ID: {room._id}</div>
      <div className="text-sm">IoT ID: {room.iotDeviceId}</div>
      <div className="text-sm">
        {t("distance")}: {room.distance ?? 0} см
      </div>
      <div className="text-sm">
        {t("brightness")}: {room.brightness ?? 100}%
      </div>
      <div className="text-sm">
        {t("status") ?? "Статус"}:{" "}
        <span className={room.status ? "text-green-400" : "text-red-400"}>
          {room.status ? "Світло увімкнено" : "Світло вимкнено"}
        </span>
      </div>
      <div className="text-xs text-[#bdbdbd] mt-2">
        {t("createdBy") ?? "Створив (ID)"}: {room.user_id ?? "невідомо"}
      </div>

      <div className="mt-2 text-sm text-blue-300 min-h-[22px]">
        {saving !== null
          ? typeof saving === "number"
            ? `${t("saving") ?? "Економія"}: ${saving}%`
            : saving
          : ""}
      </div>
      <button
        onClick={handleCalculateSaving}
        disabled={loading}
        className="mt-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition"
      >
        {loading
          ? t("calculating") ?? "Розрахунок..."
          : t("calculateSaving") ?? "Розрахувати економію"}
      </button>
    </div>
  );
};

export default RoomCard;
