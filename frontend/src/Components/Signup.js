import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import API from '../api/config'; // use config

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false); //  loading state
  const [error, setError] = useState("");         //  error state
  const [success, setSuccess] = useState("");     // success state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");    // clear error on type
    setSuccess(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/auth/signup', formData);

      setSuccess("Account created successfully! Redirecting...");
      setFormData({ name: "", email: "", password: "" });

      //  Auto redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f4f4f4"
    }}>
      <form onSubmit={handleSubmit} style={{
        display: "flex",
        flexDirection: "column",
        width: "350px",
        padding: "30px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ color: "#0F3D3E", marginBottom: "20px" }}>Create Account</h2>

        {/* ✅ Error message */}
        {error && (
          <div style={{
            backgroundColor: "#ffd6d6",
            color: "red",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "15px",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        {/* ✅ Success message */}
        {success && (
          <div style={{
            backgroundColor: "#d6ffd6",
            color: "green",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "15px",
            fontSize: "14px"
          }}>
            {success}
          </div>
        )}

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{
            marginBottom: "15px",
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px"
          }}
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{
            marginBottom: "15px",
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px"
          }}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            marginBottom: "15px",
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px"
          }}
        />

        <p
          style={{ cursor: "pointer", color: "#0F3D3E", marginBottom: "15px" }}
          onClick={() => navigate("/")}
        >
          Already have an account? Login
        </p>

        {/*  Loading button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "#0F3D3E",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;