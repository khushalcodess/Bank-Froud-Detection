import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = ({ open, openset }) => {
  const menuItems = [
    {
      path: "/Dashboard",
      label: "Dashboard",
    },
    {
      path: "/Transactions",
      label: "Transactions",
    },
    {
      path: "/Alert",
      label: "Fraud Alert",
    },
    {
      path: "/Users",
      label: "Users",
    },
  ];

  return (
    <aside className={`fg-admin-sidebar ${open ? "open" : ""}`}>
 <button
  type="button"
  className="fg-sidebar-close"
  onClick={() => openset(false)}
  aria-label="Close sidebar"
>
  ✕
</button>

      <h4 className="fg-sidebar-title" style={{
               color:"white"
            }} >Menu</h4>

      <nav className="fg-sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="fg-sidebar-link"
            onClick={() => openset(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;