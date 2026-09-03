import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

function AdminLayout() {
  return (
<div className="app-layout">
  <Navbar variant="admin" />

  <main className="main-content">
    <Outlet />
  </main>

  <Footer />
</div>
  );
}

export default AdminLayout;