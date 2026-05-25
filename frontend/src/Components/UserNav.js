import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserNav = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav style={{
      backgroundColor: "#0F3D3E",
      padding: "0 30px",
      height: "65px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
    }}>

      {/* Left - Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img src="/LOGO.png" alt="logo" width="45" height="35" />
        <span style={{ color: "white", fontWeight: "700", fontSize: "18px" }}>
          FraudGuard
        </span>
      </div>

      {/* Center - Welcome */}
      <div style={{ color: "white", fontSize: "14px", opacity: 0.9 }}>
        Welcome back, <strong>{user?.name || "User"}</strong> 👋
      </div>

      {/* Right - Profile + Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>

        {/* Account Number */}
        <span style={{
          backgroundColor: "rgba(255,255,255,0.15)",
          color: "white",
          padding: "5px 12px",
          borderRadius: "20px",
          fontSize: "13px"
        }}>
          🏦 {user?.account_number || "N/A"}
        </span>

        {/* Profile Dropdown */}
        <div className="dropdown">
          <button
            className="btn dropdown-toggle d-flex align-items-center gap-2"
            type="button"
            data-bs-toggle="dropdown"
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              color: "white",
              borderRadius: "25px",
              padding: "6px 16px",
              fontSize: "14px",
              border: "1px solid rgba(255,255,255,0.3)"
            }}
          >
            <i className="bi bi-person-fill"></i>
            <span>{user?.name || "User"}</span>
          </button>

          <ul className="dropdown-menu dropdown-menu-end"
            style={{ borderRadius: "10px" }}>
            <li>
              <div className="dropdown-item-text py-2">
                <p style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>
                  {user?.name}
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                  {user?.email}
                </p>
              </div>
            </li>
            <li><hr className="dropdown-divider my-1" /></li>
            <li>
              <button className="dropdown-item text-danger py-2" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
};

export default UserNav;