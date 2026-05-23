import React, { useState } from 'react';
import { updateAlert, updateUser } from '../api/admin';

const Alertcard = ({ alert, onUpdate }) => {
  const [loading, setLoading] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  //  Get card border color based on risk
  const getRiskColor = (score) => {
    if (score >= 71) return "#dc3545";
    if (score >= 31) return "#f39c12";
    return "#28a745";
  };

  //  Get risk label
  const getRiskLabel = (score) => {
    if (score >= 71) return "🔴 High Risk";
    if (score >= 31) return "🟡 Suspicious";
    return "🟢 Low Risk";
  };

  //  Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  //  Block user
  const handleBlock = async () => {
    setLoading("block");
    try {
      await updateUser(alert.sender_id?._id, "blocked");
      await updateAlert(alert._id, "resolved");
      onUpdate(alert._id, "resolved");
      alert("User blocked successfully!");
    } catch (err) {
      alert("Failed to block user");
    } finally {
      setLoading("");
    }
  };

  //  Mark as safe
  const handleMarkSafe = async () => {
    setLoading("safe");
    try {
      await updateAlert(alert._id, "resolved");
      onUpdate(alert._id, "resolved");
    } catch (err) {
      alert("Failed to mark safe");
    } finally {
      setLoading("");
    }
  };

  //  Get status badge
  const getStatusBadge = (status) => {
    if (status === "resolved") return (
      <span style={{
        backgroundColor: "#d4edda",
        color: "#28a745",
        padding: "3px 10px",
        borderRadius: "10px",
        fontSize: "12px"
      }}>✅ Resolved</span>
    );
    if (status === "ignored") return (
      <span style={{
        backgroundColor: "#e2e3e5",
        color: "#666",
        padding: "3px 10px",
        borderRadius: "10px",
        fontSize: "12px"
      }}>Ignored</span>
    );
    return (
      <span style={{
        backgroundColor: "#ffd6d6",
        color: "#dc3545",
        padding: "3px 10px",
        borderRadius: "10px",
        fontSize: "12px"
      }}>⚠ Pending</span>
    );
  };

  const riskColor = getRiskColor(alert.risk_score);

  return (
    <div style={{
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      border: `2px solid ${riskColor}22`,
      borderTop: `4px solid ${riskColor}`,
      overflow: "hidden"
    }}>
      <div style={{ padding: "20px" }}>

        {/*  Risk label + status */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px"
        }}>
          <span style={{
            color: riskColor,
            fontWeight: "600",
            fontSize: "14px"
          }}>
            {getRiskLabel(alert.risk_score)}
          </span>
          {getStatusBadge(alert.status)}
        </div>

        {/*  Alert details */}
        <div style={{ fontSize: "14px", lineHeight: "2" }}>
          <p style={{ margin: 0 }}>
            <strong>User:</strong> {alert.sender_id?.name || "Unknown"}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Email:</strong> {alert.sender_id?.email || "N/A"}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Amount:</strong> ₹{alert.transaction_id?.amount?.toLocaleString('en-IN') || 0}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Transaction ID:</strong> {alert.transaction_id?.txn_code || "N/A"}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Risk Score:</strong>{" "}
            <span style={{ color: riskColor, fontWeight: "600" }}>
              {alert.risk_score}/100
            </span>
          </p>
          <p style={{ margin: 0 }}>
            <strong>Time:</strong> {formatDate(alert.createdAt)}
          </p>
        </div>

        {/*  View Details Toggle */}
        {showDetails && (
          <div style={{
            marginTop: "15px",
            padding: "12px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            fontSize: "13px"
          }}>
            <p style={{ margin: "0 0 5px", fontWeight: "500" }}>
              Reason:
            </p>
            <p style={{ margin: 0, color: "#666" }}>
              {alert.reason || "No reason provided"}
            </p>
            <p style={{ margin: "8px 0 5px", fontWeight: "500" }}>
              Sender Account:
            </p>
            <p style={{ margin: 0, color: "#666" }}>
              {alert.transaction_id?.sender_account || "N/A"}
            </p>
            <p style={{ margin: "8px 0 5px", fontWeight: "500" }}>
              Receiver Account:
            </p>
            <p style={{ margin: 0, color: "#666" }}>
              {alert.transaction_id?.receiver_account || "N/A"}
            </p>
          </div>
        )}

        {/*  Action Buttons */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          gap: "8px"
        }}>
          {/* View button */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              flex: 1,
              padding: "8px",
              backgroundColor: "#0F3D3E",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "13px"
            }}
          >
            {showDetails ? "Hide" : "View"}
          </button>

          {/* Block button */}
          <button
            onClick={handleBlock}
            disabled={loading === "block" || alert.status === "resolved"}
            style={{
              flex: 1,
              padding: "8px",
              backgroundColor: alert.status === "resolved" ? "#ccc" : "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: alert.status === "resolved" ? "not-allowed" : "pointer",
              fontSize: "13px"
            }}
          >
            {loading === "block" ? "..." : "Block"}
          </button>

          {/* Mark Safe button */}
          <button
            onClick={handleMarkSafe}
            disabled={loading === "safe" || alert.status === "resolved"}
            style={{
              flex: 1,
              padding: "8px",
              backgroundColor: alert.status === "resolved" ? "#ccc" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: alert.status === "resolved" ? "not-allowed" : "pointer",
              fontSize: "13px"
            }}
          >
            {loading === "safe" ? "..." : "Mark Safe"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Alertcard;