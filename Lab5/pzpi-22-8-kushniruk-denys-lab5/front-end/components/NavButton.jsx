import { Link } from "@/i18n/routing";
import React from "react";

const NavButton = ({ text, href, active }) => {
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-md font-medium transition-colors duration-200
        ${
          active
            ? "bg-[#333333] text-white shadow"
            : "text-[#bdbdbd] hover:bg-[#232323] hover:text-white"
        }
      `}
      style={{ letterSpacing: "0.05em" }}
    >
      {text}
    </Link>
  );
};

export default NavButton;
