import React, { useState } from "react";
import Slidebar from './Slidebar';
import { useNavigate } from 'react-router-dom';
import API from '../api/config';

const Nav = () => {
  const [open, openset] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    setSearching(true);
    setShowResults(true);
    try {
      const res = await API.get(`/admin/search?q=${query}`);
      setSearchResults(res.data);
    } catch (err) {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleResultClick = (result) => {
    setShowResults(false);
    setSearchQuery("");
    if (result.type === "user") navigate("/Users");
    else navigate("/Transactions");
  };

  const handleBlur = () => {
    setTimeout(() => setShowResults(false), 200);
  };

  return (
    <>
      <Slidebar open={open} openset={openset} />

      <nav style={{
        backgroundColor: "white",
        borderBottom: "1px solid #e0e0e0",
        padding: "0 30px",
        height: "65px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // ✅ equal spacing
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}>

        {/*  Left — Hamburger + Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px", flex: 1 }}>
          <button
            onClick={() => openset(true)}
            style={{
              background: "none",
              border: "none",
              fontSize: "22px",
              color: "#0F3D3E",
              cursor: "pointer",
              padding: "5px"
            }}
          >
            ☰
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src="LOGO.png" alt="logo" width="45" height="35" />
            <span style={{
              fontWeight: "700",
              color: "#0F3D3E",
              fontSize: "18px"
            }}>
              FraudGuard
            </span>
          </div>
        </div>

        {/*  Center — Search Bar */}
        <div style={{ position: "relative", flex: 2, maxWidth: "500px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="search"
              placeholder="Search user, transaction ID, account number..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onBlur={handleBlur}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
              style={{
                width: "100%",
                padding: "8px 16px",
                border: "1px solid #ddd",
                borderRadius: "25px",
                outline: "none",
                fontSize: "14px",
                backgroundColor: "#f8f9fa"
              }}
            />
            <button style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              backgroundColor: "#0F3D3E",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              flexShrink: 0
            }}>
              🔍
            </button>
          </div>

          {/*  Search Results Dropdown */}
          {showResults && (
            <div style={{
              position: "absolute",
              top: "48px",
              left: 0,
              right: 0,
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              zIndex: 9999,
              maxHeight: "400px",
              overflowY: "auto",
              border: "1px solid #eee"
            }}>
              {searching ? (
                <div style={{ padding: "20px", textAlign: "center" }}>
                  <div className="spinner-border spinner-border-sm"
                    style={{ color: "#0F3D3E" }} />
                  <span style={{ marginLeft: "10px", color: "#888", fontSize: "14px" }}>
                    Searching...
                  </span>
                </div>
              ) : searchResults.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#888", fontSize: "14px" }}>
                  No results found for "{searchQuery}"
                </div>
              ) : (
                searchResults.map((result, index) => (
                  <div
                    key={index}
                    onClick={() => handleResultClick(result)}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px"
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "white"}
                  >
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: result.type === "user" ? "#e8f5f5" : "#ffd6d6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                      flexShrink: 0
                    }}>
                      {result.type === "user" ? "👤" : "💳"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: "500", fontSize: "14px" }}>
                        {result.name || result.txn_code}
                      </p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                        {result.type === "user"
                          ? `${result.email} • ${result.account_number || "No account"}`
                          : `₹${result.amount?.toLocaleString('en-IN')} • ${result.status}`
                        }
                      </p>
                    </div>
                    <span style={{
                      backgroundColor: result.type === "user" ? "#e8f5f5" : "#ffd6d6",
                      color: result.type === "user" ? "#0F3D3E" : "#dc3545",
                      padding: "3px 10px",
                      borderRadius: "10px",
                      fontSize: "11px",
                      fontWeight: "500",
                      flexShrink: 0
                    }}>
                      {result.type === "user" ? "User" : "Transaction"}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/*  Right — Bell + Profile */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          flex: 1,
          justifyContent: "flex-end"
        }}>

          {/* Bell */}
          <button style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            backgroundColor: "#0F3D3E",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "15px"
          }}>
            🔔
          </button>

          {/* Profile Dropdown */}
          <div className="dropdown">
            <button
              className="btn dropdown-toggle d-flex align-items-center gap-2"
              type="button"
              data-bs-toggle="dropdown"
              style={{
                backgroundColor: "#0F3D3E",
                color: "white",
                borderRadius: "25px",
                padding: "6px 16px",
                fontSize: "14px"
              }}
            >
              <i className="bi bi-person-fill"></i>
              <span>{user?.name || "Admin"}</span>
            </button>

            <ul className="dropdown-menu dropdown-menu-end"
              style={{ borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
              <li>
                <div className="dropdown-item-text py-2">
                  <p style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>
                    {user?.name || "Admin"}
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                    {user?.email || ""}
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
    </>
  );
};

export default Nav;