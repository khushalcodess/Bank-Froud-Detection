import React, { useState } from "react";
import { updateAlert, updateUser } from "../../api/admin";

const AlertCard = ({ alert, onUpdate }) => {
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
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  const riskColor = getRiskColor(alert.risk_score);

  return (
    <div
      className="fg-alert-card"
      style={{ "--risk-color": riskColor }}
    >
      <div className="fg-alert-card-body">

        {/* Risk + Status */}
        <div className="fg-alert-card-top">
          <span className="fg-alert-risk">
            {getRiskLabel(alert.risk_score)}
          </span>

          <span
            className={`fg-alert-status fg-alert-status-${alert.status}`}
          >
            {alert.status === "resolved"
              ? "✅ Resolved"
              : alert.status === "ignored"
              ? "Ignored"
              : "⚠ Pending"}
          </span>
        </div>

        {/* Risk Score */}
        <div className="fg-alert-risk-section">
          <div className="fg-alert-risk-header">
            <span>Risk Score</span>

            <span className="fg-alert-risk-score">
              {alert.risk_score}/100
            </span>
          </div>

          <div className="fg-alert-risk-bar">
            <div
              className="fg-alert-risk-progress"
              style={{ width: `${alert.risk_score}%` }}
            />
          </div>
        </div>

        {/* Details */}
        <div className="fg-alert-details">

          <div className="fg-alert-detail-row">
            <span>User</span>
            <strong>
              {alert.sender_id?.name || "Unknown"}
            </strong>
          </div>

          <div className="fg-alert-detail-row">
            <span>Amount</span>
            <strong className="fg-alert-amount">
              ₹
              {alert.transaction_id?.amount?.toLocaleString("en-IN") || 0}
            </strong>
          </div>

          <div className="fg-alert-detail-row">
            <span>Txn ID</span>
            <strong className="fg-alert-txn-id">
              {alert.transaction_id?.txn_code || "N/A"}
            </strong>
          </div>

          <div className="fg-alert-detail-row">
            <span>Time</span>
            <span className="fg-alert-time">
              {formatDate(alert.createdAt)}
            </span>
          </div>

        </div>

        {/* View Details */}
        {showDetails && (
          <div className="fg-alert-extra-details">

            <p className="fg-alert-extra-title">
              📋 Transaction Details
            </p>

            <p>
              <strong>Reason:</strong>{" "}
              {alert.reason || "No reason provided"}
            </p>

            <p>
              <strong>From:</strong>{" "}
              {alert.transaction_id?.sender_account || "N/A"}
            </p>

            <p>
              <strong>To:</strong>{" "}
              {alert.transaction_id?.receiver_account || "N/A"}
            </p>

          </div>
        )}

        {/* Actions */}
        <div className="fg-alert-actions">

          <button
            type="button"
            className="fg-alert-action fg-alert-view"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "👆 Hide" : "👁️ View"}
          </button>

          <button
            type="button"
            className="fg-alert-action fg-alert-block"
            onClick={handleBlock}
            disabled={
              loading === "block" ||
              alert.status === "resolved"
            }
          >
            {loading === "block" ? "⏳" : "🚫 Block"}
          </button>

          <button
            type="button"
            className="fg-alert-action fg-alert-safe"
            onClick={handleMarkSafe}
            disabled={
              loading === "safe" ||
              alert.status === "resolved"
            }
          >
            {loading === "safe" ? "⏳" : "✅ Safe"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default AlertCard;