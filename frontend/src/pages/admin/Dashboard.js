import React, { useState, useEffect } from "react";

import StatCard from "../../Components/dashboard/StatCard";
import FraudChart from "../../Components/dashboard/FraudChart";
import Piechart from "../../Components/dashboard/Piechart";
import TransactionTable from "../../Components/transactions/TransactionTable";
import { getStats } from "../../api/admin";

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

  // Get fraud count based on active filter
  const getFraudCount = () => {
    if (!stats) return 0;

    if (activeFilter === "today") {
      return stats.todayFraud || 0;
    }

    if (activeFilter === "month") {
      return stats.monthFraud || 0;
    }

    if (activeFilter === "year") {
      return stats.yearFraud || 0;
    }

    return 0;
  };

  // Calculate percentage
  const getPercent = (value, total) => {
    if (!total || total === 0) return 0;

    return Math.round((value / total) * 100);
  };

  // Safe transaction count
  const safeCount = Math.max(
    0,
    (stats?.totalTransactions || 0) -
      (stats?.totalFlagged || 0) -
      (stats?.totalSuspicious || 0)
  );

  // Loading state
  if (loading) {
    return (
      <div className="fg-dashboard-state">
        <div>
          <div className="fg-dashboard-loader"></div>

          <p className="fg-dashboard-loading-text">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="fg-dashboard-state">
        <div>
          <div className="fg-dashboard-error">
            {error}
          </div>

          <button
            className="fg-button fg-button-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fg-dashboard">

      {/* ================= HEADER ================= */}

      <div className="fg-dashboard-header">
        <div>
          <h2 className="fg-dashboard-title">
            Dashboard
          </h2>

          <p className="fg-dashboard-subtitle">
            Overview of your fraud detection system
          </p>
        </div>

        <span className="fg-dashboard-date">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>


      {/* ================= FILTER BUTTONS ================= */}

      <div className="fg-dashboard-filters">

        <button
          className={`fg-filter-button ${
            activeFilter === "today" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("today")}
        >
          Today
        </button>

        <button
          className={`fg-filter-button ${
            activeFilter === "month" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("month")}
        >
          This Month
        </button>

        <button
          className={`fg-filter-button ${
            activeFilter === "year" ? "active" : ""
          }`}
          onClick={() => setActiveFilter("year")}
        >
          This Year
        </button>

      </div>


      {/* ================= ACTIVE FILTER ================= */}

      <div>
        <span className="fg-active-filter">
          Showing data for:{" "}
          {activeFilter === "today"
            ? "Today"
            : activeFilter === "month"
            ? "This Month"
            : "This Year"}
        </span>
      </div>


      {/* ================= STAT CARDS ================= */}

      <div className="fg-dashboard-stats">

        {/* Total Users */}

        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          percent={
            stats?.totalUsers > 0
              ? 100
              : 0
          }
          color="#2ce1b4"
        />


        {/* Total Transactions */}

        <StatCard
          title="Total Transactions"
          value={stats?.totalTransactions || 0}
          percent={
            stats?.totalTransactions > 0
              ? 100
              : 0
          }
          color="#3523d7"
        />


        {/* Fraud Detected */}

        <StatCard
          title="Fraud Detected"
          value={getFraudCount()}
          percent={getPercent(
            getFraudCount(),
            stats?.totalTransactions || 0
          )}
          color="#dc3545"
        />


        {/* Flagged */}

        <StatCard
          title="Flagged"
          value={stats?.totalFlagged || 0}
          percent={getPercent(
            stats?.totalFlagged || 0,
            stats?.totalTransactions || 0
          )}
          color="#8bd600"
        />


        {/* Suspicious */}

        <StatCard
          title="Suspicious"
          value={stats?.totalSuspicious || 0}
          percent={getPercent(
            stats?.totalSuspicious || 0,
            stats?.totalTransactions || 0
          )}
          color="#f39c12"
        />


        {/* Pending Alerts */}

        <StatCard
          title="Pending Alerts"
          value={stats?.pendingAlerts || 0}
          percent={getPercent(
            stats?.pendingAlerts || 0,
            (stats?.totalFlagged || 0) +
              (stats?.totalSuspicious || 0)
          )}
          color="#e74c3c"
        />

      </div>


      {/* ================= FRAUD SUMMARY ================= */}

      <div className="fg-summary-grid">

        {/* TODAY */}

        <div
          className={`fg-summary-card ${
            activeFilter === "today"
              ? "active"
              : ""
          }`}
          onClick={() => setActiveFilter("today")}
        >
          <p className="fg-summary-label">
            Today
          </p>

          <h3 className="fg-summary-value">
            {stats?.todayTransactions || 0}
          </h3>

          <p className="fg-summary-description">
            transactions
          </p>

          <p className="fg-summary-fraud">
            {stats?.todayFraud || 0} fraud detected
          </p>
        </div>


        {/* THIS MONTH */}

        <div
          className={`fg-summary-card ${
            activeFilter === "month"
              ? "active"
              : ""
          }`}
          onClick={() => setActiveFilter("month")}
        >
          <p className="fg-summary-label">
            This Month
          </p>

          <h3 className="fg-summary-value">
            {stats?.monthTransactions || 0}
          </h3>

          <p className="fg-summary-description">
            transactions
          </p>

          <p className="fg-summary-fraud">
            {stats?.monthFraud || 0} fraud detected
          </p>
        </div>


        {/* THIS YEAR */}

        <div
          className={`fg-summary-card ${
            activeFilter === "year"
              ? "active"
              : ""
          }`}
          onClick={() => setActiveFilter("year")}
        >
          <p className="fg-summary-label">
            This Year
          </p>

          <h3 className="fg-summary-value">
            {stats?.yearTransactions || 0}
          </h3>

          <p className="fg-summary-description">
            transactions
          </p>

          <p className="fg-summary-fraud">
            {stats?.yearFraud || 0} fraud detected
          </p>
        </div>


        {/* SAFE TRANSACTIONS */}

        <div className="fg-summary-card">

          <p className="fg-summary-label">
            Safe Transactions
          </p>

          <h3 className="fg-summary-value fg-summary-success">
            {safeCount}
          </h3>

          <p className="fg-summary-description">
            transactions
          </p>

          <p className="fg-summary-status">
            No suspicious activity
          </p>

        </div>


        {/* PENDING ALERTS */}

        <div className="fg-summary-card">

          <p className="fg-summary-label">
            Pending Alerts
          </p>

          <h3 className="fg-summary-value fg-summary-danger">
            {stats?.pendingAlerts || 0}
          </h3>

          <p className="fg-summary-description">
            alerts
          </p>

          <p className="fg-summary-status">
            Need attention
          </p>

        </div>

      </div>


      {/* ================= CHARTS ================= */}

      <div className="fg-dashboard-charts">

        {/* Fraud Line Chart */}

        <div className="fg-dashboard-chart">
          <FraudChart
            data={stats?.last7Days || []}
            activeFilter={activeFilter}
          />
        </div>


        {/* Fraud Distribution Pie Chart */}

        <div className="fg-dashboard-chart">
          <Piechart
            safe={safeCount}
            suspicious={
              stats?.totalSuspicious || 0
            }
            flagged={
              stats?.totalFlagged || 0
            }
          />
        </div>

      </div>


      {/* ================= RECENT TRANSACTIONS ================= */}

      <div className="fg-dashboard-table">

        <TransactionTable
          transactions={
            stats?.recentTransactions || []
          }
        />

      </div>

    </div>
  );
};

export default Dashboard;