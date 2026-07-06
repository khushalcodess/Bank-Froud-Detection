import React, { useState, useEffect } from 'react';
import StatCard from '../Components/StatCard';
import FraudChart from '../Components/FraudChart';
import Piechart from '../Components/Piechart';
import Table from '../Components/Table';
import { getStats } from '../api/admin';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("today");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStats();
        setStats(res.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  //  Get fraud count based on active filter
  const getFraudCount = () => {
    if (!stats) return 0;
    if (activeFilter === "today") return stats.todayFraud || 0;
    if (activeFilter === "month") return stats.monthFraud || 0;
    if (activeFilter === "year") return stats.yearFraud || 0;
  };
  //  Add this function after getTransactionCount()
const getPercent = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};
  //  Get transaction count based on active filter
  
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
          <p className="mt-3" style={{ color: "#0F3D3E", fontSize: "16px" }}>
            Loading Dashboard...
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
        <div className="text-center">
          <div className="alert alert-danger">{error}</div>
          <button
            className="btn"
            style={{ backgroundColor: "#0F3D3E", color: "white" }}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  //  Button style helper
  const btnStyle = (filter) => ({
    padding: "8px 20px",
    marginRight: "10px",
    backgroundColor: activeFilter === filter ? "#0F3D3E" : "white",
    color: activeFilter === filter ? "white" : "#0F3D3E",
    border: "1px solid #0F3D3E",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: activeFilter === filter ? "500" : "400",
    transition: "all 0.2s"
  });

  //  Safe count for piechart
  const safeCount = Math.max(0,
    (stats?.totalTransactions || 0) -
    (stats?.totalFlagged || 0) -
    (stats?.totalSuspicious || 0)
  );

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: "40px" }}>

      {/*  Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 50px 10px"
      }}>
        <h2 style={{ color: "#0F3D3E", margin: 0 }}>Dashboard</h2>
        <span style={{ color: "#888", fontSize: "14px" }}>
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
      </div>

      {/*  Filter Buttons */}
      <div style={{ marginLeft: "50px", marginBottom: "10px", marginTop: "10px" }}>
        <button style={btnStyle("today")} onClick={() => setActiveFilter("today")}>
          Today
        </button>
        <button style={btnStyle("month")} onClick={() => setActiveFilter("month")}>
          This Month
        </button>
        <button style={btnStyle("year")} onClick={() => setActiveFilter("year")}>
          This Year
        </button>
      </div>

      {/*  Active filter label */}
      <div style={{ marginLeft: "50px", marginBottom: "25px" }}>
        <span style={{
          backgroundColor: "#e8f5f5",
          color: "#0F3D3E",
          padding: "4px 12px",
          borderRadius: "10px",
          fontSize: "13px"
        }}>
          Showing data for: {
            activeFilter === "today" ? "Today" :
            activeFilter === "month" ? "This Month" : "This Year"
          }
        </span>
      </div>

{/* ✅ Stat Cards with real percentages */}
{/* ✅ Fixed Stat Cards */}
<div className="d-flex justify-content-evenly flex-wrap" style={{ gap: "10px", padding: "0 30px" }}>

  {/* Always shows total users */}
  <StatCard
    title="Total Users"
    value={stats?.totalUsers || 0}
    percent={100}
    color="#2ce1b4"
  />

  {/* ✅ Always shows ALL TIME total transactions */}
  <StatCard
    title="Total Transactions"
    value={stats?.totalTransactions || 0}
    percent={100}
    color="#3523d7"
  />

  {/* Changes with filter */}
  <StatCard
    title="Fraud Detected"
    value={getFraudCount()}
    percent={getPercent(
      getFraudCount(),
      stats?.totalTransactions || 0
    )}
    color="#dc3545"
  />

  {/* Always shows all time flagged */}
  <StatCard
    title="Flagged"
    value={stats?.totalFlagged || 0}
    percent={getPercent(
      stats?.totalFlagged || 0,
      stats?.totalTransactions || 0
    )}
    color="#8bd600"
  />

  {/* Always shows all time suspicious */}
  <StatCard
    title="Suspicious"
    value={stats?.totalSuspicious || 0}
    percent={getPercent(
      stats?.totalSuspicious || 0,
      stats?.totalTransactions || 0
    )}
    color="#f39c12"
  />

  {/* Always shows pending alerts */}
  <StatCard
    title="Pending Alerts"
    value={stats?.pendingAlerts || 0}
    percent={getPercent(
      stats?.pendingAlerts || 0,
      (stats?.totalFlagged || 0) + (stats?.totalSuspicious || 0)
    )}
    color="#e74c3c"
  />

</div>

     {/* ✅ Fixed Fraud Summary Cards */}
<div className="d-flex justify-content-evenly mt-4 mx-4" style={{ gap: "15px" }}>

  {/* Today Card */}
  <div
    onClick={() => setActiveFilter("today")}
    style={{
      background: activeFilter === "today" ? "#0F3D3E" : "white",
      color: activeFilter === "today" ? "white" : "#0F3D3E",
      padding: "20px 25px",
      borderRadius: "12px",
      textAlign: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      cursor: "pointer",
      transition: "all 0.2s",
      flex: 1
    }}>
    <p style={{ margin: 0, fontSize: "13px", opacity: 0.8 }}>Today</p>
    {/* ✅ Show transactions not just fraud */}
    <h3 style={{ margin: "5px 0 0" }}>{stats?.todayTransactions || 0}</h3>
    <p style={{ margin: "5px 0 0", fontSize: "12px", opacity: 0.7 }}>
      transactions
    </p>
    <p style={{ margin: "3px 0 0", fontSize: "11px", opacity: 0.6 }}>
      {stats?.todayFraud || 0} fraud
    </p>
  </div>

  {/* This Month Card */}
  <div
    onClick={() => setActiveFilter("month")}
    style={{
      background: activeFilter === "month" ? "#0F3D3E" : "white",
      color: activeFilter === "month" ? "white" : "#0F3D3E",
      padding: "20px 25px",
      borderRadius: "12px",
      textAlign: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      cursor: "pointer",
      transition: "all 0.2s",
      flex: 1
    }}>
    <p style={{ margin: 0, fontSize: "13px", opacity: 0.8 }}>This Month</p>
    {/* ✅ Show monthTransactions */}
    <h3 style={{ margin: "5px 0 0" }}>{stats?.monthTransactions || 0}</h3>
    <p style={{ margin: "5px 0 0", fontSize: "12px", opacity: 0.7 }}>
      transactions
    </p>
    <p style={{ margin: "3px 0 0", fontSize: "11px", opacity: 0.6 }}>
      {stats?.monthFraud || 0} fraud
    </p>
  </div>

  {/* This Year Card */}
  <div
    onClick={() => setActiveFilter("year")}
    style={{
      background: activeFilter === "year" ? "#0F3D3E" : "white",
      color: activeFilter === "year" ? "white" : "#0F3D3E",
      padding: "20px 25px",
      borderRadius: "12px",
      textAlign: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      cursor: "pointer",
      transition: "all 0.2s",
      flex: 1
    }}>
    <p style={{ margin: 0, fontSize: "13px", opacity: 0.8 }}>This Year</p>
    {/* ✅ Show yearTransactions */}
    <h3 style={{ margin: "5px 0 0" }}>{stats?.yearTransactions || 0}</h3>
    <p style={{ margin: "5px 0 0", fontSize: "12px", opacity: 0.7 }}>
      transactions
    </p>
    <p style={{ margin: "3px 0 0", fontSize: "11px", opacity: 0.6 }}>
      {stats?.yearFraud || 0} fraud
    </p>
  </div>

  {/* Safe Transactions */}
  <div style={{
    background: "white",
    padding: "20px 25px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    flex: 1
  }}>
    <p style={{ color: "#888", margin: 0, fontSize: "13px" }}>Safe</p>
    <h3 style={{ color: "#28a745", margin: "5px 0 0" }}>
      {(stats?.totalTransactions || 0) -
       (stats?.totalFlagged || 0) -
       (stats?.totalSuspicious || 0)}
    </h3>
    <p style={{ color: "#888", margin: "5px 0 0", fontSize: "12px" }}>
      transactions
    </p>
  </div>

  {/* Pending Alerts */}
  <div style={{
    background: "white",
    padding: "20px 25px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    flex: 1
  }}>
    <p style={{ color: "#888", margin: 0, fontSize: "13px" }}>
      Pending Alerts
    </p>
    <h3 style={{ color: "#e74c3c", margin: "5px 0 0" }}>
      {stats?.pendingAlerts || 0}
    </h3>
    <p style={{ color: "#888", margin: "5px 0 0", fontSize: "12px" }}>
      need attention
    </p>
  </div>

</div>

      {/* ✅ Charts Row */}
      <div className="d-flex" style={{ marginTop: "40px", padding: "0 30px", gap: "30px" }}>

        {/* Line Chart */}
        <div style={{ width: "60%" }}>
          <FraudChart
            data={stats?.last7Days || []}
            activeFilter={activeFilter}
          />
        </div>

        {/* Pie Chart */}
        <div style={{ width: "35%" }}>
          <Piechart
            safe={safeCount}
            suspicious={stats?.totalSuspicious || 0}
            flagged={stats?.totalFlagged || 0}
          />
        </div>

      </div>

      {/*  Recent Transactions Table */}
      <div style={{ margin: "40px 30px 0" }}>
        <Table transactions={stats?.recentTransactions || []} />
      </div>

    </div>
  );
};

export default Dashboard;