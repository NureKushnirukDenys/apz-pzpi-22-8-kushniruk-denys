import { useTranslations } from "next-intl";
import React from "react";

const LogCard = ({ log }) => {
  const t = useTranslations("Logs");
  return (
    <div className="bg-[#232323] rounded-lg shadow p-4 flex flex-col gap-1 w-full h-60 min-h-[192px] max-h-[300px]">
      <div className="font-semibold text-white">{log.action}</div>
      <div className="text-xs text-[#888] mt-2">ID: {log._id}</div>
      <div className="text-xs text-[#bdbdbd]">
        {new Date(log.timestamp).toLocaleString()}
      </div>
      <div className="text-sm text-[#bdbdbd] truncate">
        {t("room")}: {log.room_id?.name || log.room_id || t("unknown")}
      </div>
      <div className="text-sm text-[#bdbdbd] truncate">
        {t("user")}: {log.user_id?.email || log.user_id || t("unknown")}
      </div>
    </div>
  );
};

export default LogCard;
