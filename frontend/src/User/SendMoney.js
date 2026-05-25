import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/config';

const SendMoney = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    receiver_account: "",
    amount: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post('/transactions/send', {
        receiver_account: form.receiver_account,
        amount: Number(form.amount)
      });

      setSuccess(res.data);
      setForm({ receiver_account: "", amount: "" });

    } catch (err) {
      setError(err.response?.data?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  //  Get risk color
  const getRiskColor = (score) => {
    if (score >= 71) return "#dc3545";
    if (score >= 31) return "#f39c12";
    return "#28a745";
  };

  return (
    <div>
      <h2 style={{ color: "#0F3D3E", marginBottom: "25px" }}>Send Money</h2>

      <div style={{ display: "flex", gap: "25px", alignItems: "flex-start" }}>

        {/*  Send Money Form */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "30px",
          flex: 1,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>
          <h5 style={{ color: "#0F3D3E", marginBottom: "20px" }}>
            💸 Transfer Money
          </h5>

          {/* Error */}
          {error && (
            <div style={{
              backgroundColor: "#ffd6d6",
              color: "#dc3545",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "15px",
              fontSize: "14px"
            }}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Receiver Account */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#333",
                fontSize: "14px"
              }}>
                Receiver Account Number
              </label>
              <input
                type="text"
                name="receiver_account"
                value={form.receiver_account}
                onChange={handleChange}
                placeholder="e.g. ACC1234567890"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {/* Amount */}
            <div style={{ marginBottom: "25px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "500",
                color: "#333",
                fontSize: "14px"
              }}>
                Amount (₹)
              </label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                min="1"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: loading ? "#ccc" : "#0F3D3E",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s"
              }}
            >
              {loading ? "Processing..." : "Send Money 💸"}
            </button>

          </form>
        </div>

        {/*  Result Card */}
        {success && (
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "30px",
            flex: 1,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            borderTop: `4px solid ${getRiskColor(success.risk_score)}`
          }}>
            <h5 style={{ color: "#0F3D3E", marginBottom: "20px" }}>
              Transaction Result
            </h5>

            {/* Status */}
            <div style={{
              textAlign: "center",
              padding: "20px",
              backgroundColor: success.status === "flagged" ? "#ffd6d6"
                : success.status === "suspicious" ? "#fff3cd" : "#d4edda",
              borderRadius: "12px",
              marginBottom: "20px"
            }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>
                {success.status === "flagged" ? "🚨"
                  : success.status === "suspicious" ? "⚠️" : "✅"}
              </div>
              <h4 style={{
                color: getRiskColor(success.risk_score),
                margin: 0,
                textTransform: "capitalize"
              }}>
                {success.status === "flagged" ? "Transaction Flagged!"
                  : success.status === "suspicious" ? "Suspicious Activity"
                  : "Transaction Successful!"}
              </h4>
            </div>

            {/* Details */}
            <div style={{ fontSize: "14px", lineHeight: "2.2" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#888" }}>Transaction ID</span>
                <span style={{ fontWeight: "500" }}>
                  {success.transaction?.txn_code}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#888" }}>Amount</span>
                <span style={{ fontWeight: "600", color: "#dc3545" }}>
                  -₹{success.transaction?.amount?.toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#888" }}>Risk Score</span>
                <span style={{
                  fontWeight: "600",
                  color: getRiskColor(success.risk_score)
                }}>
                  {success.risk_score}/100
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#888" }}>Status</span>
                <span style={{
                  fontWeight: "600",
                  color: getRiskColor(success.risk_score),
                  textTransform: "capitalize"
                }}>
                  {success.status}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                onClick={() => setSuccess(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#0F3D3E",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                New Transaction
              </button>
              <button
                onClick={() => navigate("/my-transactions")}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "white",
                  color: "#0F3D3E",
                  border: "1px solid #0F3D3E",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                View History
              </button>
            </div>
          </div>
        )}

        {/*  Info Card when no result */}
        {!success && (
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "30px",
            flex: 1,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <h5 style={{ color: "#0F3D3E", marginBottom: "20px" }}>
              ℹ️ How It Works
            </h5>
            <div style={{ fontSize: "14px", lineHeight: "2", color: "#555" }}>
              <p>1️⃣ Enter receiver's account number</p>
              <p>2️⃣ Enter amount to send</p>
              <p>3️⃣ Click Send Money</p>
              <p>4️⃣ Our ML model evaluates the transaction</p>
              <p>5️⃣ Transaction is classified as:</p>
              <div style={{ paddingLeft: "20px" }}>
                <p style={{ color: "#28a745" }}>✅ Safe — processed immediately</p>
                <p style={{ color: "#f39c12" }}>⚠️ Suspicious — flagged for review</p>
                <p style={{ color: "#dc3545" }}>🚨 Flagged — blocked for safety</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SendMoney;