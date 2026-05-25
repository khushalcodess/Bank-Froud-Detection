import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/config'; //  use config instead of axios directly

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false); // loading state
  const [error, setError] = useState(""); // error state

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // clear error on type
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);

      //  Save token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      //  Role based redirect
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
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <div className="bg-white p-4 rounded shadow" style={{ width: "400px" }}>
        <h3 className="mb-4" style={{ color: "#0F3D3E" }}>Login</h3>

        {/*  Show error message */}
        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter password"
              required
            />
          </div>

          <div className="mb-3">
            <p
              style={{ cursor: "pointer", color: "#0F3D3E" }}
              onClick={() => navigate("/Signup")}
            >
              Register A Account
            </p>
          </div>

          {/* Loading button */}
          <button
            type="submit"
            className="btn w-100"
            style={{ backgroundColor: "#0F3D3E", color: "white" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;