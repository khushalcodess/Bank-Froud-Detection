import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/user-dashboard", icon: "📊", label: "Dashboard" },
    { path: "/send-money", icon: "💸", label: "Send Money" },
    { path: "/my-transactions", icon: "📋", label: "My Transactions" },
  ];

  const itemStyle = (path) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 20px",
    cursor: "pointer",
    borderRadius: "10px",
    margin: "4px 10px",
    backgroundColor: location.pathname === path ? "rgba(255,255,255,0.15)" : "transparent",
    color: "white",
    transition: "all 0.2s",
    fontWeight: location.pathname === path ? "600" : "400"
  });

  return (
    <div style={{
      width: "220px",
      backgroundColor: "#0F3D3E",
      minHeight: "calc(100vh - 65px)",
      paddingTop: "20px",
      flexShrink: 0
    }}>

      {/* Menu Items */}
      {menuItems.map((item) => (
        <div
          key={item.path}
          style={itemStyle(item.path)}
          onClick={() => navigate(item.path)}
          onMouseEnter={e => {
            if (location.pathname !== item.path)
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
          }}
          onMouseLeave={e => {
            if (location.pathname !== item.path)
              e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <span style={{ fontSize: "18px" }}>{item.icon}</span>
          <span style={{ fontSize: "14px" }}>{item.label}</span>
        </div>
      ))}

      {/* Bottom - Account Info */}
      <div style={{
        position: "absolute",
        bottom: "80px",
        width: "220px",
        padding: "15px 20px",
        borderTop: "1px solid rgba(255,255,255,0.1)"
      }}>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", margin: "0 0 5px" }}>
          ACCOUNT
        </p>
        <p style={{ color: "white", fontSize: "13px", margin: 0, fontWeight: "500" }}>
          {JSON.parse(localStorage.getItem("user") || "{}")?.account_number || "N/A"}
        </p>
      </div>

    </div>
  );
};

export default UserSidebar;