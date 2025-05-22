import Header from "@/components/Header";
import UserManagement from "@/components/UserManagement";
import React from "react";

const UsersPage = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen pt-8 px-2 -mt-[75px] flex flex-col items-center justify-center">
        <UserManagement />
      </div>
    </>
  );
};

export default UsersPage;
