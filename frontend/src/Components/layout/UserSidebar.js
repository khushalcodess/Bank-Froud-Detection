import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      path: "/user-dashboard",
      icon: "📊",
      label: "Dashboard",
    },
    {
      path: "/send-money",
      icon: "💸",
      label: "Send Money",
    },
    {
      path: "/my-transactions",
      icon: "📋",
      label: "My Transactions",
    },
  ];

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <aside className="fg-user-sidebar">
      <nav className="fg-user-sidebar-nav">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              type="button"
              className={`fg-user-sidebar-item ${
                isActive ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              <span className="fg-user-sidebar-icon">
                {item.icon}
              </span>

              <span className="fg-user-sidebar-label">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Account Info */}
      <div className="fg-user-sidebar-account">
        <p className="fg-user-sidebar-account-label">
          ACCOUNT
        </p>

        <p className="fg-user-sidebar-account-number">
          {user?.account_number || "N/A"}
        </p>
      </div>
    </aside>
  );
};

export default UserSidebar;