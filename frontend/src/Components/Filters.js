import React, { useState } from 'react';

const Filters = ({ onFilter }) => {
  const [active, setActive] = useState("today");

  const filters = [
    { key: "today", label: "Today", icon: "📅" },
    { key: "week", label: "Last Week", icon: "📆" },
    { key: "month", label: "Last Month", icon: "🗓️" },
    { key: "year", label: "Last Year", icon: "📊" },
  ];

  const handleFilter = (key) => {
    setActive(key);
    if (onFilter) onFilter(key);
  };

  return (
    <div style={{
      display: "flex",
      gap: "12px",
      padding: "0 30px",
      flexWrap: "wrap"
    }}>
      {filters.map(filter => (
        <button
          key={filter.key}
          onClick={() => handleFilter(filter.key)}
          style={{
            padding: "9px 20px",
            backgroundColor: active === filter.key ? "#0F3D3E" : "white",
            color: active === filter.key ? "white" : "#0F3D3E",
            border: "1.5px solid #0F3D3E",
            borderRadius: "25px",
            cursor: "pointer",
            fontWeight: "500",
            fontSize: "14px",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: active === filter.key
              ? "0 4px 12px rgba(15,61,62,0.3)"
              : "none"
          }}
          onMouseEnter={e => {
            if (active !== filter.key) {
              e.currentTarget.style.backgroundColor = "#e8f5f5";
            }
          }}
          onMouseLeave={e => {
            if (active !== filter.key) {
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

export default Filters;