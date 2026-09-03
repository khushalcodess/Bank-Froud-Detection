import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../layout/AdminSidebar";
import API from "../../api/config";

const Navbar = ({ variant = "public" }) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  // Admin search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ==========================================
  // Logout
  // ==========================================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // ==========================================
  // Admin Search
  // ==========================================
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
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // ==========================================
  // Search Result Click
  // ==========================================
  const handleResultClick = (result) => {
    setShowResults(false);
    setSearchQuery("");

    if (result.type === "user") {
      navigate("/Users");
    } else {
      navigate("/Transactions");
    }
  };

  // ==========================================
  // Search Blur
  // ==========================================
  const handleBlur = () => {
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  // ==========================================
  // Landing Page Navigation
  // ==========================================
  const handlePublicNav = (section) => {
    if (window.location.pathname === "/") {
      document.getElementById(section)?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      navigate(`/#${section}`);
    }
  };

  // ==========================================
  // PUBLIC NAVBAR
  // ==========================================
  if (variant === "public") {
    return (
      <header className="fg-navbar">
        <div className="fg-navbar-container">

          {/* Logo */}
          <Link to="/" className="fg-navbar-brand">
            <img
              src="/LOGO.png"
              alt="FraudGuard logo"
              className="fg-navbar-logo-image"
            />

            <span>FraudGuard</span>
          </Link>

          {/* Navigation */}
          <nav className="fg-navbar-links">
            <button onClick={() => handlePublicNav("how")}>
              How it works
            </button>

            <button onClick={() => handlePublicNav("features")}>
              Platform
            </button>

            <button onClick={() => handlePublicNav("security")}>
              Security
            </button>

            <button onClick={() => handlePublicNav("faq")}>
              Pricing
            </button>
          </nav>

          {/* Actions */}
          <div className="fg-navbar-actions">
            <button
              className="fg-navbar-login"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>

            <button
              className="fg-navbar-register"
              onClick={() => navigate("/Signup")}
            >
              Register
            </button>
          </div>

        </div>
      </header>
    );
  }

  // ==========================================
  // ADMIN NAVBAR
  // ==========================================
  if (variant === "admin") {
    return (
      <>
        {/* Admin Sidebar */}
        <AdminSidebar
          open={open}
          openset={setOpen}
        />

        <nav className="fg-admin-navbar">

          {/* LEFT */}
          <div className="fg-admin-navbar-left">

            {/* Hamburger */}
            <button
              className="fg-admin-menu-button"
              onClick={() => setOpen(true)}
              aria-label="Open sidebar"
            >
              ☰
            </button>

            {/* Logo */}
            <Link
              to="/Dashboard"
              className="fg-admin-brand"
            >
              <img
                src="/LOGO.png"
                alt="FraudGuard logo"
              />

              <span>FraudGuard</span>
            </Link>

          </div>


          {/* CENTER - SEARCH */}
          <div className="fg-admin-search">

            <div className="fg-admin-search-box">

              <input
                type="search"
                placeholder="Search user, transaction ID, account number..."
                value={searchQuery}
                onChange={(e) =>
                  handleSearch(e.target.value)
                }
                onBlur={handleBlur}
                onFocus={() =>
                  searchQuery.length >= 2 &&
                  setShowResults(true)
                }
              />

              <button
                type="button"
                aria-label="Search"
              >
                🔍
              </button>

            </div>


            {/* SEARCH RESULTS */}
            {showResults && (
              <div className="fg-admin-search-results">

                {searching ? (
                  <div className="fg-search-message">
                    <div className="fg-search-spinner"></div>

                    <span>
                      Searching...
                    </span>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="fg-search-message">
                    No results found for "{searchQuery}"
                  </div>
                ) : (
                  searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="fg-search-result"
                      onClick={() =>
                        handleResultClick(result)
                      }
                    >

                      <div
                        className={`fg-search-result-icon ${
                          result.type === "user"
                            ? "user"
                            : "transaction"
                        }`}
                      >
                        {result.type === "user"
                          ? "👤"
                          : "💳"}
                      </div>

                      <div className="fg-search-result-info">

                        <p>
                          {result.name ||
                            result.txn_code}
                        </p>

                        <span>
                          {result.type === "user"
                            ? `${result.email} • ${
                                result.account_number ||
                                "No account"
                              }`
                            : `₹${result.amount?.toLocaleString(
                                "en-IN"
                              )} • ${
                                result.status
                              }`}
                        </span>

                      </div>

                      <span
                        className={`fg-search-result-type ${
                          result.type === "user"
                            ? "user"
                            : "transaction"
                        }`}
                      >
                        {result.type === "user"
                          ? "User"
                          : "Transaction"}
                      </span>

                    </div>
                  ))
                )}

              </div>
            )}

          </div>


          {/* RIGHT */}
          <div className="fg-admin-navbar-right">

            {/* Notification */}
            <button
              className="fg-navbar-icon-button"
              onClick={() => navigate("/Alert")}
              aria-label="Alerts"
            >
              🔔
            </button>


            {/* Profile */}
            <div className="dropdown">

              <button
                className="fg-profile-button"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-fill"></i>

                <span>
                  {user?.name || "Admin"}
                </span>
              </button>


              <ul className="dropdown-menu dropdown-menu-end fg-profile-menu">

                <li>
                  <div className="dropdown-item-text py-2">

                    <p className="fg-profile-name">
                      {user?.name || "Admin"}
                    </p>

                    <p className="fg-profile-email">
                      {user?.email || ""}
                    </p>

                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider my-1" />
                </li>

                <li>
                  <button
                    className="dropdown-item text-danger py-2"
                    onClick={handleLogout}
                  >
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
  }


  // ==========================================
  // USER NAVBAR
  // ==========================================
  if (variant === "user") {
    return (
      <nav className="fg-user-navbar">

        {/* LEFT - LOGO */}
        <Link
          to="/user-dashboard"
          className="fg-user-brand"
        >
          <img
            src="/LOGO.png"
            alt="FraudGuard logo"
          />

          <span>FraudGuard</span>
        </Link>


        {/* CENTER - WELCOME */}
        <div className="fg-user-welcome">
          Welcome back,{" "}
          <strong>
            {user?.name || "User"}
          </strong>{" "}
          👋
        </div>


        {/* RIGHT */}
        <div className="fg-user-navbar-right">

          {/* Account Number */}
          <span className="fg-account-badge">
            🏦{" "}
            {user?.account_number || "N/A"}
          </span>


          {/* Profile */}
          <div className="dropdown">

            <button
              className="fg-user-profile-button"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-person-fill"></i>

              <span>
                {user?.name || "User"}
              </span>
            </button>


            <ul className="dropdown-menu dropdown-menu-end fg-profile-menu">

              <li>
                <div className="dropdown-item-text py-2">

                  <p className="fg-profile-name">
                    {user?.name || "User"}
                  </p>

                  <p className="fg-profile-email">
                    {user?.email || ""}
                  </p>

                </div>
              </li>

              <li>
                <hr className="dropdown-divider my-1" />
              </li>

              <li>
                <button
                  className="dropdown-item text-danger py-2"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </li>

            </ul>

          </div>

        </div>

      </nav>
    );
  }

  return null;
};

export default Navbar;