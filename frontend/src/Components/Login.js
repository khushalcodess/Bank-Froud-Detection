import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/config';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") {
        navigate("/Dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (e) {
      setError(e.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0F3D3E 0%, #1a6b6d 50%, #0F3D3E 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "420px",
        animation: "fadeIn 0.5s ease"
      }}>

        {/* Logo Section */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{
            width: "70px",
            height: "70px",
            backgroundColor: "rgba(255,255,255,0.15)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 15px",
            fontSize: "32px",
            backdropFilter: "blur(10px)"
          }}>
            🛡️
          </div>
          <h2 style={{
            color: "white",
            fontWeight: "700",
            fontSize: "28px",
            margin: 0
          }}>
            FraudGuard
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "14px",
            margin: "5px 0 0"
          }}>
            Secure Banking System
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "35px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
        }}>
          <h4 style={{
            color: "#0F3D3E",
            fontWeight: "600",
            marginBottom: "5px"
          }}>
            Welcome Back 👋
          </h4>
          <p style={{
            color: "#888",
            fontSize: "14px",
            marginBottom: "25px"
          }}>
            Sign in to your account
          </p>

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "12px 15px",
              borderRadius: "10px",
              marginBottom: "20px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#333",
                fontSize: "14px"
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "10px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                  backgroundColor: "#fafafa"
                }}
                onFocus={e => e.target.style.borderColor = "#0F3D3E"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#333",
                fontSize: "14px"
              }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 45px 12px 16px",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "10px",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                    backgroundColor: "#fafafa"
                  }}
                  onFocus={e => e.target.style.borderColor = "#0F3D3E"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
                {/* Show/Hide Password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    color: "#888"
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                backgroundColor: loading ? "#6b9e9f" : "#0F3D3E",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                marginBottom: "15px"
              }}
              onMouseEnter={e => !loading && (e.target.style.backgroundColor = "#1a6b6d")}
              onMouseLeave={e => !loading && (e.target.style.backgroundColor = "#0F3D3E")}
            >
              {loading ? (
                <span>
                  <span style={{
                    display: "inline-block",
                    width: "14px",
                    height: "14px",
                    border: "2px solid white",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    marginRight: "8px",
                    verticalAlign: "middle"
                  }}></span>
                  Signing in...
                </span>
              ) : "Sign In →"}
            </button>

            {/* Register Link */}
            <p style={{
              textAlign: "center",
              color: "#888",
              fontSize: "14px",
              margin: 0
            }}>
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/Signup")}
                style={{
                  color: "#0F3D3E",
                  fontWeight: "600",
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
              >
                Register here
              </span>
            </p>

          </form>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.5)",
          fontSize: "12px",
          marginTop: "20px"
        }}>
          © 2026 FraudGuard. All rights reserved.
        </p>

      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;