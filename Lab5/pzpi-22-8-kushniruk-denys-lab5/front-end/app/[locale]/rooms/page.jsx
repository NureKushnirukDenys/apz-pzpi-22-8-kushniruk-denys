"use client";

import CreateRoomForm from "@/components/Rooms/CreateRoomForm";
import EditRoomForm from "@/components/Rooms/EditRoomForm";
import Header from "@/components/Header";
import RoomCard from "@/components/Rooms/RoomCard";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const t = useTranslations("Rooms");

  const fetchRooms = async () => {
    try {
      const res = await fetch("http://localhost:5000/rooms");
      const data = await res.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch {
      setRooms([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Додаємо нову кімнату в список після створення
  const handleRoomCreated = (newRoom) => {
    setRooms((prev) => [newRoom, ...prev]);
    setShowForm(false); // ховаємо форму після створення
  };

  const handleRoomUpdated = (updatedRoom) => {
    setRooms((prev) =>
      prev.map((room) => (room._id === updatedRoom._id ? updatedRoom : room))
    );
  };

  // Видалення кімнати
  const handleDeleteRoom = async (room) => {
    setRoomToDelete(room);
  };

  const confirmDeleteRoom = async () => {
    if (!roomToDelete) return;
    try {
      const res = await fetch(
        `http://localhost:5000/rooms/delete/${roomToDelete._id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setRooms((prev) => prev.filter((r) => r._id !== roomToDelete._id));
        setRoomToDelete(null);
      }
    } catch {
      // можна додати обробку помилки
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const searchStr = search.toLowerCase();
    return (
      room.name?.toLowerCase().includes(searchStr) ||
      room._id?.toLowerCase().includes(searchStr) ||
      room.iotDeviceId?.toLowerCase().includes(searchStr) ||
      String(room.distance ?? "")
        .toLowerCase()
        .includes(searchStr) ||
      (room.status ? "увімкнено" : "вимкнено").includes(searchStr) ||
      (room.user_id
        ? String(room.user_id).toLowerCase().includes(searchStr)
        : false)
    );
  });

  return (
    <>
      <Header />
      <div className="min-h-100% mt-20 px-2 relative">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          {t("title")}
        </h2>

        {/* ... */}
        {/* Модальне підтвердження видалення */}
        {roomToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-[#232323] rounded-lg p-6 shadow max-w-xs w-full text-center">
              <div className="text-white text-lg mb-4">
                {t("deleteConfirm")} <b>{roomToDelete.name}</b>?
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmDeleteRoom}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded px-4 py-2 transition"
                >
                  {t("delete")}
                </button>
                <button
                  onClick={() => setRoomToDelete(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded px-4 py-2 transition"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* ... */}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="relative">
              <CreateRoomForm onRoomCreated={handleRoomCreated} />
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-2 right-2 text-white hover:text-red-500 rounded-full w-8 h-8 flex items-center justify-center"
                title="Закрити"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {editRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <EditRoomForm
              room={editRoom}
              onClose={() => setEditRoom(null)}
              onRoomUpdated={handleRoomUpdated}
            />
          </div>
        )}

        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 px-4 py-2 rounded border border-[#353535] bg-[#181818] text-white w-full max-w-xl mx-auto block"
        />

        {loading ? (
          <div className="text-center text-white">{t("loading")}</div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center text-[#bdbdbd]">{t("notFound")}</div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                onEdit={setEditRoom}
                onDelete={handleDeleteRoom}
              />
            ))}
          </div>
        )}
        {/* Floating button */}
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-8 right-8 z-40 bg-[#181818] hover:bg-[#272727] text-white font-semibold rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-lg transition"
          title={t("createRoom")}
        >
          +
        </button>
      </div>
    </>
  );
};

export default RoomsPage;
