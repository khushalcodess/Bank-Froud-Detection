import React, { useState } from "react";
import { updateUser } from "../../api/admin";

const UserTable = ({ users, onUpdate }) => {
  const [loadingId, setLoadingId] = useState(null);

  // Block or unblock user
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

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="fg-user-table-card">
      <div className="fg-user-table-wrapper">
        <table className="fg-user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Account No.</th>
              <th>Balance</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <div className="fg-user-table-empty">
                    <div className="fg-user-table-empty-icon">👥</div>

                    <p className="fg-user-table-empty-title">
                      No users found
                    </p>

                    <p className="fg-user-table-empty-text">
                      Users will appear here after registration
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user._id}
                  className={
                    user.status === "blocked"
                      ? "fg-user-row-blocked"
                      : ""
                  }
                >
                  {/* Number */}
                  <td className="fg-user-table-index">
                    {index + 1}
                  </td>

                  {/* Name */}
                  <td>
                    <div className="fg-user-table-name">
                      <div className="fg-user-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>

                      <span>{user.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="fg-user-table-email">
                    {user.email}
                  </td>

                  {/* Account Number */}
                  <td>
                    <span className="fg-user-account-badge">
                      {user.account_number || "N/A"}
                    </span>
                  </td>

                  {/* Balance */}
                  <td className="fg-user-table-balance">
                    ₹{user.balance?.toLocaleString("en-IN") || 0}
                  </td>

                  {/* Joined */}
                  <td className="fg-user-table-date">
                    {formatDate(user.createdAt)}
                  </td>

                  {/* Status */}
                  <td>
                    {user.status === "active" ? (
                      <span className="fg-user-status fg-user-status-active">
                        ✅ Active
                      </span>
                    ) : (
                      <span className="fg-user-status fg-user-status-blocked">
                        🚫 Blocked
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td>
                    <button
                      type="button"
                      className={`fg-user-action-button ${
                        user.status === "active"
                          ? "block"
                          : "unblock"
                      }`}
                      onClick={() =>
                        handleStatusChange(user._id, user.status)
                      }
                      disabled={loadingId === user._id}
                    >
                      {loadingId === user._id
                        ? "..."
                        : user.status === "active"
                        ? "Block"
                        : "Unblock"}
                    </button>
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

export default UserTable;