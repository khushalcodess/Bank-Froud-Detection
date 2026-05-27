import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/config';

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
  try {
    const [profileRes, txnRes] = await Promise.all([
      API.get('/auth/profile'),
      API.get('/transactions/my')
    ]);

    const profileData = profileRes.data.user;
    setUserData(profileData);

    // ✅ Update localStorage with latest balance and account_number
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem("user", JSON.stringify({
      ...storedUser,
      balance: profileData.balance,
      account_number: profileData.account_number
    }));

    setTransactions(txnRes.data.transactions?.slice(0, 5) || []);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}>
        <div className="text-center">
          <div className="spinner-border" style={{ color: "#0F3D3E" }} />
          <p className="mt-3" style={{ color: "#0F3D3E" }}>Loading...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    if (status === "flagged") return "#dc3545";
    if (status === "suspicious") return "#f39c12";
    return "#28a745";
  };

  return (
    <div>

      {/*  Welcome Header */}
      <div style={{ marginBottom: "25px" }}>
        <h2 style={{ color: "#0F3D3E", margin: 0 }}>
          Good {new Date().getHours() < 12 ? "Morning" :
                new Date().getHours() < 17 ? "Afternoon" : "Evening"},
          {user?.name}! 👋
        </h2>
        <p style={{ color: "#888", margin: "5px 0 0" }}>
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long', year: 'numeric',
            month: 'long', day: 'numeric'
          })}
        </p>
      </div>

      {/*  Balance Card + Quick Send */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "25px" }}>

        {/* Balance Card */}
        <div style={{
          background: "linear-gradient(135deg, #0F3D3E, #1a6b6d)",
          borderRadius: "16px",
          padding: "30px",
          color: "white",
          flex: 1.5,
          boxShadow: "0 8px 24px rgba(15,61,62,0.3)"
        }}>
          <p style={{ margin: 0, opacity: 0.8, fontSize: "14px" }}>
            Account Balance
          </p>
          <h1 style={{ margin: "10px 0", fontSize: "36px", fontWeight: "700" }}>
            ₹{(userData?.balance || 0).toLocaleString('en-IN')}
          </h1>
          <p style={{ margin: 0, opacity: 0.7, fontSize: "13px" }}>
            Account: {userData?.account_number || "N/A"}
          </p>
          <button
            onClick={() => navigate("/send-money")}
            style={{
              marginTop: "20px",
              padding: "10px 24px",
              backgroundColor: "white",
              color: "#0F3D3E",
              border: "none",
              borderRadius: "25px",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            💸 Send Money
          </button>
        </div>

        {/* Quick Stats */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "15px"
          }}>
            <div style={{
              width: "45px", height: "45px", borderRadius: "12px",
              backgroundColor: "#e8f5f5", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: "20px"
            }}>📤</div>
            <div>
              <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Total Sent</p>
              <h4 style={{ margin: 0, color: "#0F3D3E" }}>
                {transactions.filter(t => t.sender_account === userData?.account_number).length}
              </h4>
            </div>
          </div>

          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "15px"
          }}>
            <div style={{
              width: "45px", height: "45px", borderRadius: "12px",
              backgroundColor: "#ffd6d6", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: "20px"
            }}>🚨</div>
            <div>
              <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Flagged</p>
              <h4 style={{ margin: 0, color: "#dc3545" }}>
                {transactions.filter(t => t.status === "flagged").length}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/*  Recent Transactions */}
      <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}>
          <h5 style={{ color: "#0F3D3E", margin: 0 }}>Recent Transactions</h5>
          <button
            onClick={() => navigate("/my-transactions")}
            style={{
              backgroundColor: "transparent",
              color: "#0F3D3E",
              border: "1px solid #0F3D3E",
              borderRadius: "20px",
              padding: "5px 15px",
              cursor: "pointer",
              fontSize: "13px"
            }}
          >
            View All
          </button>
        </div>

        {transactions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
            <div style={{ fontSize: "40px" }}>💳</div>
            <p>No transactions yet</p>
            <button
              onClick={() => navigate("/send-money")}
              style={{
                backgroundColor: "#0F3D3E",
                color: "white",
                border: "none",
                borderRadius: "20px",
                padding: "8px 20px",
                cursor: "pointer"
              }}
            >
              Make First Transaction
            </button>
          </div>
        ) : (
          transactions.map((txn, index) => (
            <div key={index} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: index < transactions.length - 1 ? "1px solid #f0f0f0" : "none"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "40px", height: "40px",
                  borderRadius: "50%",
                  backgroundColor: txn.sender_account === userData?.account_number
                    ? "#ffd6d6" : "#d4edda",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px"
                }}>
                  {txn.sender_account === userData?.account_number ? "📤" : "📥"}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: "500", fontSize: "14px" }}>
                    {txn.sender_account === userData?.account_number
                      ? `To: ${txn.receiver_account}`
                      : `From: ${txn.sender_account}`}
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>
                    {txn.txn_code} • {new Date(txn.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{
                  margin: 0,
                  fontWeight: "600",
                  color: txn.sender_account === userData?.account_number
                    ? "#dc3545" : "#28a745"
                }}>
                  {txn.sender_account === userData?.account_number ? "-" : "+"}
                  ₹{txn.amount?.toLocaleString('en-IN')}
                </p>
                <span style={{
                  fontSize: "11px",
                  color: getStatusColor(txn.status),
                  fontWeight: "500"
                }}>
                  {txn.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserDashboard;