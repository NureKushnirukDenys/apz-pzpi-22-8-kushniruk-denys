"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import React, { use, useEffect, useState } from "react";
import LanguageSelector from "./LanguageSelector/LanguageSelector";
import NavButton from "./NavButton";

const Header = () => {
  const t = useTranslations("Navigation");
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    function syncUser() {
      const userData = localStorage.getItem("user");
      if (userData && userData !== "undefined") {
        try {
          setUser(JSON.parse(userData));
        } catch {
          setUser(null);
          localStorage.removeItem("user");
        }
      } else {
        setUser(null);
      }
    }

    syncUser();
    window.addEventListener("storage", syncUser);

    return () => window.removeEventListener("storage", syncUser);
  }, []);

  // Функція виходу
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload(); // або router.push("/sign-in")
  };

  return (
    <header className="bg-[#121212] text-white px-8 py-4 flex items-center justify-between shadow-md">
      <div className="font-bold text-2xl tracking-widest">
        <Link href="/">SLC System</Link>
      </div>
      <div className="flex items-center justify-center gap-4">
        <NavButton text={t("homeButton")} href="/" active={pathname === "/"} />
        <NavButton
          text={t("usersButton")}
          href="/users"
          active={pathname === "/users"}
        />
        <NavButton
          text={t("roomsButton")}
          href="/rooms"
          active={pathname === "/rooms"}
        />
        <NavButton
          text={t("logsButton")}
          href="/logs"
          active={pathname === "/logs"}
        />
      </div>
      <div className="flex gap-4 items-center">
        <LanguageSelector />
        <div className="flex gap-4 items-center">
          {!user ? (
            <>
              <Link
                className="hover:bg-[#363636] px-5 py-2 duration-300 rounded"
                href="/sign-in"
              >
                {t("signInButton")}
              </Link>
              <Link
                className="hover:bg-[#363636] px-5 py-2 duration-300 rounded"
                href="/sign-up"
              >
                {t("signUpButton")}
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <img
                src={user.profileImage}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>
                {user.firstName} {user.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
              >
                {t("logoutButton")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
