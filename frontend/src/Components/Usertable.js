import React, { useState } from 'react';
import { updateUser } from '../api/admin';

const Usertable = ({ users, onUpdate }) => {

  const [loadingId, setLoadingId] = useState(null);

  // ✅ Block or unblock user
  const handleStatusChange = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    setLoadingId(userId);
    try {
      await updateUser(userId, newStatus);
      onUpdate(userId, newStatus);
    } catch (err) {
      alert("Failed to update user status");
    } finally {
      setLoadingId(null);
    }
  };

  // ✅ Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f3f3" }}>
            <th style={{ padding: "12px", textAlign: "center" }}>#</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Name</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Email</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Account No.</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Balance</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Joined</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Status</th>
            <th style={{ padding: "12px", textAlign: "center" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="8" style={{
                textAlign: "center",
                padding: "50px",
                color: "#888"
              }}>
                <div style={{ fontSize: "30px", marginBottom: "10px" }}>👥</div>
                <p style={{ margin: 0, fontWeight: "500" }}>No users found</p>
                <p style={{ margin: "5px 0 0", fontSize: "13px" }}>
                  Users will appear here after registration
                </p>
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr
                key={user._id}
                style={{
                  borderBottom: "1px solid #f0f0f0",
                  backgroundColor: user.status === "blocked" ? "#fff5f5" : "white",
                  textAlign: "center"
                }}
              >
                {/* # */}
                <td style={{ padding: "12px", color: "#888", fontSize: "13px" }}>
                  {index + 1}
                </td>

                {/* Name */}
                <td style={{ padding: "12px" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px"
                  }}>
                    {/* ✅ Avatar circle */}
                    <div style={{
                      width: "35px",
                      height: "35px",
                      borderRadius: "50%",
                      backgroundColor: "#0F3D3E",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "600",
                      fontSize: "14px"
                    }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: "500" }}>{user.name}</span>
                  </div>
                </td>

                {/* Email */}
                <td style={{ padding: "12px", fontSize: "13px", color: "#555" }}>
                  {user.email}
                </td>

                {/* Account Number */}
                <td style={{ padding: "12px", fontSize: "13px" }}>
                  <span style={{
                    backgroundColor: "#e8f5f5",
                    color: "#0F3D3E",
                    padding: "3px 10px",
                    borderRadius: "10px",
                    fontSize: "12px"
                  }}>
                    {user.account_number || "N/A"}
                  </span>
                </td>

                {/* Balance */}
                <td style={{ padding: "12px", fontWeight: "500", color: "#0F3D3E" }}>
                  ₹{user.balance?.toLocaleString('en-IN') || 0}
                </td>

                {/* Joined Date */}
                <td style={{ padding: "12px", fontSize: "13px", color: "#888" }}>
                  {formatDate(user.createdAt)}
                </td>

                {/* Status Badge */}
                <td style={{ padding: "12px" }}>
                  {user.status === "active" ? (
                    <span style={{
                      backgroundColor: "#d4edda",
                      color: "#28a745",
                      padding: "4px 12px",
                      borderRadius: "10px",
                      fontSize: "12px",
                      fontWeight: "500"
                    }}>
                      ✅ Active
                    </span>
                  ) : (
                    <span style={{
                      backgroundColor: "#ffd6d6",
                      color: "#dc3545",
                      padding: "4px 12px",
                      borderRadius: "10px",
                      fontSize: "12px",
                      fontWeight: "500"
                    }}>
                      🚫 Blocked
                    </span>
                  )}
                </td>

                {/* Action Button */}
                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() => handleStatusChange(user._id, user.status)}
                    disabled={loadingId === user._id}
                    style={{
                      padding: "6px 16px",
                      backgroundColor: user.status === "active" ? "#dc3545" : "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: loadingId === user._id ? "not-allowed" : "pointer",
                      fontSize: "13px",
                      fontWeight: "500",
                      transition: "all 0.2s"
                    }}
                  >
                    {loadingId === user._id
                      ? "..."
                      : user.status === "active"
                        ? "Block"
                        : "Unblock"
                    }
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Usertable;