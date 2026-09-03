import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import UserSidebar from "./UserSidebar";
import Footer from "../common/Footer";

function UserLayout() {
  return (
   <div className="app-layout user-app-layout">
  <Navbar variant="user" />

  <div className="user-layout-body">
    <UserSidebar />

    <main className="user-main-content">
      <Outlet />
    </main>
  </div>

  <Footer />
</div>
  );
}

export default UserLayout;