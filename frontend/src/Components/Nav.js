import React, { useState } from "react";
import Slidebar from './Slidebar';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
  const [open, openset] = useState(false);
  const navigate = useNavigate();

  //  Logout function
  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login
    navigate("/");
  };

  // Get user name from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <>
      <Slidebar open={open} openset={openset} />
      <div>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light border-top border-bottom"
            style={{ backgroundColor: "white", color: "#0F3D3E" }}>
            <div className="container-fluid" style={{ color: "white" }}>

              {/* Hamburger */}
              <button
                className="btn me-3"
                onClick={() => openset(true)}
                style={{ fontSize: "22px", color: "#0F3D3E" }}
              >
                ☰
              </button>

              {/* Logo */}
              <a className="navbar-brand d-flex align-items-center" href="/">
                <img src="LOGO.png" alt="" width="80" height="54" />
                <span className="fw-bold" style={{ color: "#0F3D3E" }}>FraudGuard</span>
              </a>

              {/* Search */}
              <div className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search transaction ID / account number..."
                  style={{ width: "600px", marginLeft: "250px" }}
                />
                <button
                  type="button"
                  className="btn btn-primary rounded-circle"
                  style={{ backgroundColor: "#0F3D3E" }}
                >
                  🔍︎
                </button>
              </div>

              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                  {/* Bell Icon */}
                  <button
                    type="button"
                    className="btn rounded-circle"
                    style={{
                      backgroundColor: "#0F3D3E",
                      color: "white",
                      marginLeft: "400px"
                    }}
                  >
                    <i className="bi bi-bell-fill"></i>
                  </button>

                  {/*  Profile Dropdown with real name and logout */}
                  <div className="dropdown" style={{ marginLeft: "20px" }}>
                    <button
                      className="btn btn-secondary dropdown-toggle d-flex align-items-center gap-2"
                      type="button"
                      data-bs-toggle="dropdown"
                      style={{ backgroundColor: "#0F3D3E" }}
                    >
                      <i className="bi bi-person-fill"></i>
                      {/*  Show admin name */}
                      <span style={{ fontSize: "13px" }}>
                        {user?.name || "Admin"}
                      </span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">

                      {/*  Show user info */}
                      <li>
                        <div className="dropdown-item-text">
                          <p style={{ margin: 0, fontWeight: "500", fontSize: "14px" }}>
                            {user?.name || "Admin"}
                          </p>
                          <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                            {user?.email || ""}
                          </p>
                        </div>
                      </li>

                      <li><hr className="dropdown-divider" /></li>

                      {/* Logout button */}
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={handleLogout}
                        >
                          <i className="bi bi-box-arrow-right me-2"></i>
                          Logout
                        </button>
                      </li>

                    </ul>
                  </div>

                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Nav;