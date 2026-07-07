import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import API from '../api/config';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/signup', formData);
      setSuccess("Account created successfully! Redirecting...");
      setFormData({ name: "", email: "", password: "" });
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
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
      <div style={{ width: "100%", maxWidth: "420px", animation: "fadeIn 0.5s ease" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{
            width: "70px", height: "70px",
            backgroundColor: "rgba(255,255,255,0.15)",
            borderRadius: "20px",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 15px", fontSize: "32px"
          }}>
            🛡️
          </div>
          <h2 style={{ color: "white", fontWeight: "700", fontSize: "28px", margin: 0 }}>
            FraudGuard
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", margin: "5px 0 0" }}>
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
          <h4 style={{ color: "#0F3D3E", fontWeight: "600", marginBottom: "5px" }}>
            Create Account 🚀
          </h4>
          <p style={{ color: "#888", fontSize: "14px", marginBottom: "25px" }}>
            Join FraudGuard today
          </p>

          {/* Error */}
          {error && (
            <div style={{
              backgroundColor: "#fef2f2", border: "1px solid #fecaca",
              color: "#dc2626", padding: "12px 15px", borderRadius: "10px",
              marginBottom: "20px", fontSize: "14px"
            }}>
              ❌ {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={{
              backgroundColor: "#f0fdf4", border: "1px solid #86efac",
              color: "#16a34a", padding: "12px 15px", borderRadius: "10px",
              marginBottom: "20px", fontSize: "14px"
            }}>
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{
                display: "block", marginBottom: "8px",
                fontWeight: "500", color: "#333", fontSize: "14px"
              }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%", padding: "12px 16px",
                  border: "1.5px solid #e5e7eb", borderRadius: "10px",
                  fontSize: "14px", outline: "none",
                  boxSizing: "border-box", backgroundColor: "#fafafa",
                  transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "#0F3D3E"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{
                display: "block", marginBottom: "8px",
                fontWeight: "500", color: "#333", fontSize: "14px"
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%", padding: "12px 16px",
                  border: "1.5px solid #e5e7eb", borderRadius: "10px",
                  fontSize: "14px", outline: "none",
                  boxSizing: "border-box", backgroundColor: "#fafafa",
                  transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "#0F3D3E"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block", marginBottom: "8px",
                fontWeight: "500", color: "#333", fontSize: "14px"
              }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%", padding: "12px 45px 12px 16px",
                    border: "1.5px solid #e5e7eb", borderRadius: "10px",
                    fontSize: "14px", outline: "none",
                    boxSizing: "border-box", backgroundColor: "#fafafa",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={e => e.target.style.borderColor = "#0F3D3E"}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", fontSize: "16px", color: "#888"
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px",
                backgroundColor: loading ? "#6b9e9f" : "#0F3D3E",
                color: "white", border: "none", borderRadius: "10px",
                fontSize: "15px", fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s", marginBottom: "15px"
              }}
              onMouseEnter={e => !loading && (e.target.style.backgroundColor = "#1a6b6d")}
              onMouseLeave={e => !loading && (e.target.style.backgroundColor = "#0F3D3E")}
            >
              {loading ? "Creating Account..." : "Create Account 🚀"}
            </button>

            {/* Login Link */}
            <p style={{ textAlign: "center", color: "#888", fontSize: "14px", margin: 0 }}>
              Already have an account?{" "}
              <span
                onClick={() => navigate("/")}
                style={{
                  color: "#0F3D3E", fontWeight: "600",
                  cursor: "pointer", textDecoration: "underline"
                }}
              >
                Sign in
              </span>
            </p>

          </form>
        </div>

        <p style={{
          textAlign: "center", color: "rgba(255,255,255,0.5)",
          fontSize: "12px", marginTop: "20px"
        }}>
          © 2026 FraudGuard. All rights reserved.
        </p>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Signup;