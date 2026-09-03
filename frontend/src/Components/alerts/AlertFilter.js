import React from "react";

const AlertFilter = ({ activeFilter, onFilter }) => {
  const filters = [
    {
      key: "all",
      label: "All Alerts",
      color: "#0F3D3E",
      icon: "📋",
    },
    {
      key: "highrisk",
      label: "High Risk",
      color: "#dc3545",
      icon: "🔴",
    },
    {
      key: "suspicious",
      label: "Suspicious",
      color: "#f39c12",
      icon: "🟡",
    },
    {
      key: "multiple",
      label: "Multiple Txns",
      color: "#7b2fbf",
      icon: "🔁",
    },
  ];

  return (
    <div className="fg-alert-filter">
      {filters.map((filter) => (
        <button
          key={filter.key}
          type="button"
          className={`fg-alert-filter-button ${
            activeFilter === filter.key ? "active" : ""
          }`}
          style={{
            "--filter-color": filter.color,
          }}
          onClick={() => onFilter(filter.key)}
        >
          <span>{filter.icon}</span>
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default AlertFilter;