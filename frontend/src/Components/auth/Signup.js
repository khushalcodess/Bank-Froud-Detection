import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/config";
import "../../styles/auth.css";
const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await API.post("/auth/signup", formData);

      setSuccess(
        "Account created successfully! Redirecting..."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      setTimeout(() => navigate("/"), 2000);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Something went wrong"
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
              BUILD A SAFER FINANCIAL FUTURE
            </div>

            <h1>
              Detect risk.
              <span> Protect trust.</span>
            </h1>

            <p>
              Create your FraudGuard account and get access
              to intelligent transaction monitoring designed
              to identify suspicious activity before it becomes
              a bigger problem.
            </p>

          </div>


          {/* Feature List */}
          <div className="auth-feature-list">

            <div className="auth-feature">

              <span className="auth-feature-check">
                ✓
              </span>

              <div>
                <strong>Intelligent monitoring</strong>
                <p>
                  Analyze transaction behavior in real time.
                </p>
              </div>

            </div>


            <div className="auth-feature">

              <span className="auth-feature-check">
                ✓
              </span>

              <div>
                <strong>Explainable risk detection</strong>
                <p>
                  Understand why a transaction is flagged.
                </p>
              </div>

            </div>


            <div className="auth-feature">

              <span className="auth-feature-check">
                ✓
              </span>

              <div>
                <strong>Secure account access</strong>
                <p>
                  Built with security at the core.
                </p>
              </div>

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
              GET STARTED
            </span>

            <h2>Create your account</h2>

            <p>
              Set up your account and start using FraudGuard.
            </p>

          </div>


          {/* ERROR */}
          {error && (
            <div className="auth-error">

              <span>!</span>

              <p>{error}</p>

            </div>
          )}


          {/* SUCCESS */}
          {success && (
            <div className="auth-success">

              <span>✓</span>

              <p>{success}</p>

            </div>
          )}


          <form
            onSubmit={handleSubmit}
            className="auth-form"
          >

            {/* NAME */}
            <div className="auth-field">

              <label htmlFor="name">
                Full name
              </label>

              <div className="auth-input-wrapper">

                <span className="auth-input-icon">
                  👤
                </span>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* EMAIL */}
            <div className="auth-field">

              <label htmlFor="signup-email">
                Email address
              </label>

              <div className="auth-input-wrapper">

                <span className="auth-input-icon">
                  @
                </span>

                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div className="auth-field">

              <label htmlFor="signup-password">
                Password
              </label>

              <div className="auth-input-wrapper">

                <span className="auth-input-icon">
                  ●
                </span>

                <input
                  id="signup-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
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
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <span>→</span>
                </>
              )}

            </button>

          </form>


          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>


          <Link
            to="/login"
            className="auth-secondary-button"
          >
            Sign in
          </Link>


          <p className="auth-legal">
            Your information is handled securely and used
            only to provide FraudGuard services.
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

export default Signup;