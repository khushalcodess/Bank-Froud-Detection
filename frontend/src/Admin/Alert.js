import React, { useState, useEffect } from 'react';
import Afilter from '../Components/Afilter';
import Alertcard from '../Components/Alertcard';
import { getAlerts } from '../api/admin';

const Alert = () => {
  const [alerts, setAlerts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //  Fetch alerts from backend
  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await getAlerts();
      setAlerts(res.data.alerts);
      setFiltered(res.data.alerts);
    } catch (err) {
      setError("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  //  Filter alerts
  const handleFilter = (filter) => {
    setActiveFilter(filter);
    if (filter === "all") {
      setFiltered(alerts);
    } else if (filter === "highrisk") {
      setFiltered(alerts.filter(a =>
        a.risk_score >= 71
      ));
    } else if (filter === "suspicious") {
      setFiltered(alerts.filter(a =>
        a.risk_score >= 31 && a.risk_score < 71
      ));
    } else if (filter === "multiple") {
      setFiltered(alerts.filter(a =>
        a.reason?.toLowerCase().includes("frequency") ||
        a.reason?.toLowerCase().includes("multiple")
      ));
    }
  };

  // Update alert in list after action
  const handleAlertUpdate = (alertId, newStatus) => {
    const updated = alerts.map(a =>
      a._id === alertId ? { ...a, status: newStatus } : a
    );
    setAlerts(updated);
    setFiltered(updated.filter(a => {
      if (activeFilter === "all") return true;
      if (activeFilter === "highrisk") return a.risk_score >= 71;
      if (activeFilter === "suspicious") return a.risk_score >= 31 && a.risk_score < 71;
      return true;
    }));
  };

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
            Loading Alerts...
          </p>
        </div>
      </div>
    );
  }

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
        <h2 style={{ color: "#0F3D3E", margin: 0 }}>Fraud Alerts</h2>
        <span style={{
          backgroundColor: "#ffd6d6",
          color: "#dc3545",
          padding: "4px 12px",
          borderRadius: "10px",
          fontSize: "13px",
          fontWeight: "500"
        }}>
          {filtered.length} Alerts
        </span>
      </div>

      {/* Filter */}
      <Afilter
        activeFilter={activeFilter}
        onFilter={handleFilter}
      />

      {/*  Empty state */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px", color: "#888" }}>
          <div style={{ fontSize: "50px" }}>✅</div>
          <h4 style={{ color: "#0F3D3E" }}>No alerts found!</h4>
          <p>No fraud alerts for selected filter</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          padding: "20px 30px"
        }}>
          {filtered.map((alert) => (
            <Alertcard
              key={alert._id}
              alert={alert}
              onUpdate={handleAlertUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Alert;