import React from 'react';

const Afilter = ({ activeFilter, onFilter }) => {

  const filters = [
    { key: "all", label: "All Alerts", color: "#0F3D3E", icon: "📋" },
    { key: "highrisk", label: "High Risk", color: "#dc3545", icon: "🔴" },
    { key: "suspicious", label: "Suspicious", color: "#f39c12", icon: "🟡" },
    { key: "multiple", label: "Multiple Txns", color: "#7b2fbf", icon: "🔁" },
  ];

  return (
    <div style={{
      display: "flex",
      gap: "12px",
      padding: "0 30px",
      margin: "20px 0",
      flexWrap: "wrap"
    }}>
      {filters.map(filter => (
        <button
          key={filter.key}
          onClick={() => onFilter(filter.key)}
          style={{
            padding: "10px 20px",
            backgroundColor: activeFilter === filter.key ? filter.color : "white",
            color: activeFilter === filter.key ? "white" : filter.color,
            border: `1.5px solid ${filter.color}`,
            borderRadius: "25px",
            cursor: "pointer",
            fontWeight: "500",
            fontSize: "14px",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: activeFilter === filter.key
              ? `0 4px 12px ${filter.color}40`
              : "none"
          }}
          onMouseEnter={e => {
            if (activeFilter !== filter.key) {
              e.currentTarget.style.backgroundColor = filter.color + "15";
            }
          }}
          onMouseLeave={e => {
            if (activeFilter !== filter.key) {
              e.currentTarget.style.backgroundColor = "white";
            }
          }}
        >
          {filter.icon} {filter.label}
        </button>
      ))}
    </div>
  );
};

export default Afilter;