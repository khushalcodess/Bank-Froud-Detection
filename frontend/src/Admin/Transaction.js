import React, { useState, useEffect } from 'react';
import Tfilter from '../Components/Tfilter';
import Table from '../Components/Table';
import { getAllTransactions } from '../api/admin';

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //  Fetch all transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getAllTransactions();
        setTransactions(res.data.transactions);
        setFiltered(res.data.transactions); // show all by default
      } catch (err) {
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  //  Filter transactions when button clicked
  const handleFilter = (filter) => {
    setActiveFilter(filter);
    if (filter === "all") {
      setFiltered(transactions);
    } else if (filter === "fraud") {
      setFiltered(transactions.filter(t =>
        t.status === "flagged" || t.status === "suspicious"
      ));
    } else if (filter === "safe") {
      setFiltered(transactions.filter(t => t.status === "safe"));
    } else if (filter === "highrisk") {
      setFiltered(transactions.filter(t => t.risk_score >= 71));
    }
  };

  //  Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}>
        <div className="text-center">
          <div className="spinner-border"
            style={{ color: "#0F3D3E", width: "50px", height: "50px" }}
            role="status"
          />
          <p className="mt-3" style={{ color: "#0F3D3E" }}>
            Loading Transactions...
          </p>
        </div>
      </div>
    );
  }

  //  Error state
  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: "40px" }}>

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 50px 10px"
      }}>
        <h2 style={{ color: "#0F3D3E", margin: 0 }}>Transactions</h2>
        <span style={{
          backgroundColor: "#e8f5f5",
          color: "#0F3D3E",
          padding: "4px 12px",
          borderRadius: "10px",
          fontSize: "13px"
        }}>
          Showing {filtered.length} of {transactions.length} transactions
        </span>
      </div>

      {/*  Pass filter handler and activeFilter to Tfilter */}
      <Tfilter
        activeFilter={activeFilter}
        onFilter={handleFilter}
      />

      <div style={{ margin: "0 30px" }}>
        <Table transactions={filtered} />
      </div>

    </div>
  );
};

export default Transaction;