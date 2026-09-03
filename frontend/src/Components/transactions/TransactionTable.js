import React from "react";

const TransactionTable = ({ transactions = [] }) => {
  const getRowClass = (status) => {
    if (status === "flagged") {
      return "fg-transaction-row flagged";
    }

    if (status === "suspicious") {
      return "fg-transaction-row suspicious";
    }

    return "fg-transaction-row";
  };

  const getStatus = (status) => {
    if (status === "flagged") {
      return (
        <span className="fg-status-badge flagged">
          ⚠ Flagged
        </span>
      );
    }

    if (status === "suspicious") {
      return (
        <span className="fg-status-badge suspicious">
          ⚡ Suspicious
        </span>
      );
    }

    return (
      <span className="fg-status-badge safe">
        ✓ Safe
      </span>
    );
  };

  const getRiskClass = (score) => {
    if (score >= 71) {
      return "high";
    }

    if (score >= 31) {
      return "medium";
    }

    return "low";
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

  return (
    <div className="fg-table-card">

      {/* Header */}
      <div className="fg-table-header">
        <div>
          <h3 className="fg-table-title">
            Recent Transactions
          </h3>

          <p className="fg-table-subtitle">
            Latest transaction activity and risk analysis
          </p>
        </div>

        <span className="fg-table-count">
          {transactions.length === 0
            ? "No transactions yet"
            : `Last ${transactions.length} transactions`}
        </span>
      </div>

      {/* Table */}
      <div className="fg-table-wrapper">
        <table className="fg-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Risk Score</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="fg-table-empty">
                  <div className="fg-table-empty-icon">
                    📋
                  </div>

                  <p className="fg-table-empty-title">
                    No transactions yet
                  </p>

                  <p className="fg-table-empty-description">
                    Transactions will appear here automatically
                  </p>
                </td>
              </tr>
            ) : (
              transactions.map((txn, index) => (
                <tr
                  key={`${txn._id}-${index}`}
                  className={getRowClass(txn.status)}
                >
                  {/* ID */}
                  <td className="fg-table-id">
                    {txn.txn_code || txn._id?.slice(-6)}
                  </td>

                  {/* Sender */}
                  <td>
                    <div className="fg-user-name">
                      {txn.sender_id?.name || "Unknown"}
                    </div>

                    <div className="fg-account-number">
                      {txn.sender_account}
                    </div>
                  </td>

                  {/* Receiver */}
                  <td>
                    <div className="fg-user-name">
                      {txn.receiver_id?.name || "Unknown"}
                    </div>

                    <div className="fg-account-number">
                      {txn.receiver_account}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="fg-transaction-amount">
                    ₹{txn.amount?.toLocaleString("en-IN")}
                  </td>

                  {/* Date */}
                  <td className="fg-transaction-date">
                    {formatDate(txn.createdAt)}
                  </td>

                  {/* Risk */}
                  <td>
                    <span
                      className={`fg-risk-badge ${getRiskClass(
                        txn.risk_score
                      )}`}
                    >
                      {txn.risk_score}/100
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    {getStatus(txn.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;