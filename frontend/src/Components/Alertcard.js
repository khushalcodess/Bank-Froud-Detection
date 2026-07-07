import React, { useState } from 'react';
import { updateAlert, updateUser } from '../api/admin';

const Alertcard = ({ alert, onUpdate }) => {
  const [loading, setLoading] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const getRiskColor = (score) => {
    if (score >= 71) return "#dc3545";
    if (score >= 31) return "#f39c12";
    return "#28a745";
  };

  const getRiskLabel = (score) => {
    if (score >= 71) return "🔴 High Risk";
    if (score >= 31) return "🟡 Suspicious";
    return "🟢 Low Risk";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // ✅ Fixed - renamed alert param to avoid conflict
  const handleBlock = async () => {
    setLoading("block");
    try {
      await updateUser(alert.sender_id?._id, "blocked");
      await updateAlert(alert._id, "resolved");
      onUpdate(alert._id, "resolved");
    } catch (err) {
      console.error("Failed to block user", err);
    } finally {
      setLoading("");
    }
  };

  const handleMarkSafe = async () => {
    setLoading("safe");
    try {
      await updateAlert(alert._id, "resolved");
      onUpdate(alert._id, "resolved");
    } catch (err) {
      console.error("Failed to mark safe", err);
    } finally {
      setLoading("");
    }
  };

  const getStatusBadge = (status) => {
    if (status === "resolved") return (
      <span style={{
        backgroundColor: "#d4edda", color: "#28a745",
        padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500"
      }}>✅ Resolved</span>
    );
    if (status === "ignored") return (
      <span style={{
        backgroundColor: "#e2e3e5", color: "#666",
        padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500"
      }}>Ignored</span>
    );
    return (
      <span style={{
        backgroundColor: "#ffd6d6", color: "#dc3545",
        padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500"
      }}>⚠ Pending</span>
    );
  };

  const riskColor = getRiskColor(alert.risk_score);

  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
      border: `1px solid ${riskColor}33`,
      borderTop: `4px solid ${riskColor}`,
      overflow: "hidden",
      transition: "transform 0.2s, box-shadow 0.2s"
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
      }}
    >
      <div style={{ padding: "20px" }}>

        {/* Risk + Status */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "15px"
        }}>
          <span style={{ color: riskColor, fontWeight: "700", fontSize: "14px" }}>
            {getRiskLabel(alert.risk_score)}
          </span>
          {getStatusBadge(alert.status)}
        </div>

        {/* Risk Score Bar */}
        <div style={{ marginBottom: "15px" }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginBottom: "5px", fontSize: "12px", color: "#888"
          }}>
            <span>Risk Score</span>
            <span style={{ color: riskColor, fontWeight: "600" }}>
              {alert.risk_score}/100
            </span>
          </div>
          <div style={{
            height: "6px", backgroundColor: "#f0f0f0",
            borderRadius: "10px", overflow: "hidden"
          }}>
            <div style={{
              height: "100%",
              width: `${alert.risk_score}%`,
              backgroundColor: riskColor,
              borderRadius: "10px",
              transition: "width 0.5s ease"
            }} />
          </div>
        </div>

        {/* Details */}
        <div style={{
          fontSize: "13px", lineHeight: "1.8",
          backgroundColor: "#f8f9fa", borderRadius: "10px", padding: "12px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ color: "#888" }}>User</span>
            <span style={{ fontWeight: "500" }}>{alert.sender_id?.name || "Unknown"}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ color: "#888" }}>Amount</span>
            <span style={{ fontWeight: "600", color: "#dc3545" }}>
              ₹{alert.transaction_id?.amount?.toLocaleString('en-IN') || 0}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ color: "#888" }}>Txn ID</span>
            <span style={{ fontWeight: "500", fontSize: "12px" }}>
              {alert.transaction_id?.txn_code || "N/A"}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "#888" }}>Time</span>
            <span style={{ fontSize: "12px" }}>{formatDate(alert.createdAt)}</span>
          </div>
        </div>

        {/* View Details */}
        {showDetails && (
          <div style={{
            marginTop: "12px", padding: "12px",
            backgroundColor: "#fff3cd", borderRadius: "10px",
            fontSize: "13px", border: "1px solid #ffeeba"
          }}>
            <p style={{ margin: "0 0 6px", fontWeight: "600", color: "#856404" }}>
              📋 Transaction Details
            </p>
            <p style={{ margin: "0 0 4px", color: "#666" }}>
              <strong>Reason:</strong> {alert.reason || "No reason provided"}
            </p>
            <p style={{ margin: "0 0 4px", color: "#666" }}>
              <strong>From:</strong> {alert.transaction_id?.sender_account || "N/A"}
            </p>
            <p style={{ margin: 0, color: "#666" }}>
              <strong>To:</strong> {alert.transaction_id?.receiver_account || "N/A"}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: "flex", gap: "8px", marginTop: "15px"
        }}>
          <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              flex: 1, padding: "9px",
              backgroundColor: "white", color: "#0F3D3E",
              border: "1.5px solid #0F3D3E", borderRadius: "8px",
              cursor: "pointer", fontSize: "13px", fontWeight: "500",
              transition: "all 0.2s"
            }}
          >
            {showDetails ? "👆 Hide" : "👁️ View"}
          </button>

          <button
            onClick={handleBlock}
            disabled={loading === "block" || alert.status === "resolved"}
            style={{
              flex: 1, padding: "9px",
              backgroundColor: alert.status === "resolved" ? "#e5e7eb" : "#dc3545",
              color: alert.status === "resolved" ? "#9ca3af" : "white",
              border: "none", borderRadius: "8px",
              cursor: alert.status === "resolved" ? "not-allowed" : "pointer",
              fontSize: "13px", fontWeight: "500", transition: "all 0.2s"
            }}
          >
            {loading === "block" ? "⏳" : "🚫 Block"}
          </button>

          <button
            onClick={handleMarkSafe}
            disabled={loading === "safe" || alert.status === "resolved"}
            style={{
              flex: 1, padding: "9px",
              backgroundColor: alert.status === "resolved" ? "#e5e7eb" : "#28a745",
              color: alert.status === "resolved" ? "#9ca3af" : "white",
              border: "none", borderRadius: "8px",
              cursor: alert.status === "resolved" ? "not-allowed" : "pointer",
              fontSize: "13px", fontWeight: "500", transition: "all 0.2s"
            }}
          >
            {loading === "safe" ? "⏳" : "✅ Safe"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Alertcard;