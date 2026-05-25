import React, { useState, useEffect } from 'react';
import API from '../api/config';

const MyTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await API.get('/transactions/my');
      setTransactions(res.data.transactions || []);
      setFiltered(res.data.transactions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filter
  const handleFilter = (filter) => {
    setActiveFilter(filter);
    if (filter === "all") setFiltered(transactions);
    else if (filter === "sent") {
      setFiltered(transactions.filter(t =>
        t.sender_account === user.account_number
      ));
    } else if (filter === "received") {
      setFiltered(transactions.filter(t =>
        t.receiver_account === user.account_number
      ));
    } else if (filter === "flagged") {
      setFiltered(transactions.filter(t =>
        t.status === "flagged" || t.status === "suspicious"
      ));
    }
  };

  const btnStyle = (filter) => ({
    padding: "7px 18px",
    marginRight: "10px",
    backgroundColor: activeFilter === filter ? "#0F3D3E" : "white",
    color: activeFilter === filter ? "white" : "#0F3D3E",
    border: "1px solid #0F3D3E",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: activeFilter === filter ? "500" : "400"
  });

  const getStatusColor = (status) => {
    if (status === "flagged") return "#dc3545";
    if (status === "suspicious") return "#f39c12";
    return "#28a745";
  };

  const getRiskBg = (status) => {
    if (status === "flagged") return "#ffd6d6";
    if (status === "suspicious") return "#fff3cd";
    return "white";
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}>
        <div className="text-center">
          <div className="spinner-border" style={{ color: "#0F3D3E" }} />
          <p className="mt-3" style={{ color: "#0F3D3E" }}>Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <h2 style={{ color: "#0F3D3E", margin: 0 }}>My Transactions</h2>
        <span style={{
          backgroundColor: "#e8f5f5",
          color: "#0F3D3E",
          padding: "4px 12px",
          borderRadius: "10px",
          fontSize: "13px"
        }}>
          {filtered.length} transactions
        </span>
      </div>

      {/* Filter Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <button style={btnStyle("all")} onClick={() => handleFilter("all")}>
          All
        </button>
        <button style={btnStyle("sent")} onClick={() => handleFilter("sent")}>
          📤 Sent
        </button>
        <button style={btnStyle("received")} onClick={() => handleFilter("received")}>
          📥 Received
        </button>
        <button style={btnStyle("flagged")} onClick={() => handleFilter("flagged")}>
          🚨 Flagged
        </button>
      </div>

      {/* Transactions List */}
      <div style={{
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        overflow: "hidden"
      }}>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
            <div style={{ fontSize: "40px" }}>📋</div>
            <p style={{ fontWeight: "500" }}>No transactions found</p>
          </div>
        ) : (
          filtered.map((txn, index) => {
            const isSent = txn.sender_account === user.account_number;
            return (
              <div key={index} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                borderBottom: index < filtered.length - 1
                  ? "1px solid #f0f0f0" : "none",
                backgroundColor: getRiskBg(txn.status)
              }}>

                {/* Left */}
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <div style={{
                    width: "45px", height: "45px",
                    borderRadius: "50%",
                    backgroundColor: isSent ? "#ffd6d6" : "#d4edda",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px"
                  }}>
                    {isSent ? "📤" : "📥"}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>
                      {isSent ? `To: ${txn.receiver_account}` : `From: ${txn.sender_account}`}
                    </p>
                    <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#888" }}>
                      {txn.txn_code} •{" "}
                      {new Date(txn.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short',
                        year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div style={{ textAlign: "right" }}>
                  <p style={{
                    margin: 0,
                    fontWeight: "700",
                    fontSize: "16px",
                    color: isSent ? "#dc3545" : "#28a745"
                  }}>
                    {isSent ? "-" : "+"}₹{txn.amount?.toLocaleString('en-IN')}
                  </p>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "4px" }}>
                    <span style={{
                      fontSize: "11px",
                      color: getStatusColor(txn.status),
                      fontWeight: "500",
                      textTransform: "capitalize"
                    }}>
                      {txn.status}
                    </span>
                    <span style={{
                      fontSize: "11px",
                      color: txn.risk_score >= 71 ? "#dc3545"
                        : txn.risk_score >= 31 ? "#f39c12" : "#28a745",
                      fontWeight: "500"
                    }}>
                      Risk: {txn.risk_score}/100
                    </span>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyTransactions;