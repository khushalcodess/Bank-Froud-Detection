import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/config";
import "../../styles/auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") {
        navigate("/Dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (e) {
      setError(
        e.response?.data?.message || "Login failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* LEFT SIDE */}
      <section className="auth-brand-panel">

        <div className="auth-brand-content">

          <Link to="/" className="auth-logo">
            <span className="auth-logo-icon">🛡</span>
            <span>FraudGuard</span>
          </Link>

          <div className="auth-brand-copy">

            <div className="auth-eyebrow">
              <span className="auth-eyebrow-dot"></span>
              AI-POWERED FRAUD DETECTION
            </div>

            <h1>
              Security that moves
              <span> at the speed of money.</span>
            </h1>

            <p>
              Monitor transactions, detect suspicious activity,
              and protect your financial ecosystem with intelligent
              fraud detection.
            </p>

          </div>

          {/* Security Card */}
          <div className="auth-security-card">

            <div className="auth-security-icon">
              ✓
            </div>

            <div>
              <strong>Protected by FraudGuard</strong>
              <p>
                Your account and transaction activity are continuously
                monitored for suspicious behavior.
              </p>
            </div>

          </div>

          <div className="auth-trust-row">

            <div>
              <strong>&lt;300ms</strong>
              <span>Detection</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Monitoring</span>
            </div>

            <div>
              <strong>AI</strong>
              <span>Risk Analysis</span>
            </div>

          </div>

        </div>

        <div className="auth-panel-footer">
          © 2026 FraudGuard
        </div>

      </section>


      {/* RIGHT SIDE */}
      <section className="auth-form-panel">

        <div className="auth-form-container">

          <div className="mobile-auth-logo">
            <Link to="/" className="auth-logo">
              <span className="auth-logo-icon">🛡</span>
              <span>FraudGuard</span>
            </Link>
          </div>

          <div className="auth-form-header">

            <span className="auth-form-label">
              SECURE ACCESS
            </span>

            <h2>Welcome back</h2>

            <p>
              Sign in to continue to your FraudGuard account.
            </p>

          </div>


          {/* ERROR */}
          {error && (
            <div className="auth-error">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}


          <form onSubmit={handleSubmit} className="auth-form">

            {/* EMAIL */}
            <div className="auth-field">

              <label htmlFor="email">
                Email address
              </label>

              <div className="auth-input-wrapper">

                <span className="auth-input-icon">
                  @
                </span>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div className="auth-field">

              <div className="auth-label-row">

                <label htmlFor="password">
                  Password
                </label>

                <span className="auth-hint">
                  Keep it secure
                </span>

              </div>

              <div className="auth-input-wrapper">

                <span className="auth-input-icon">
                  ●
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "🙈" : "👁"}
                </button>

              </div>

            </div>


            {/* SUBMIT */}
            <button
              type="submit"
              className="auth-submit-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="auth-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <span>→</span>
                </>
              )}

            </button>

          </form>


          <div className="auth-divider">
            <span>New to FraudGuard?</span>
          </div>


          <Link
            to="/Signup"
            className="auth-secondary-button"
          >
            Create an account
          </Link>


          <p className="auth-legal">
            By continuing, you agree to FraudGuard's
            security and account policies.
          </p>


          <Link
            to="/"
            className="auth-back-link"
          >
            ← Back to FraudGuard
          </Link>

        </div>

      </section>

    </div>
  );
};

export default Login;