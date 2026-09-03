import React from "react";

const TransactionFilter = ({ activeFilter, onFilter }) => {
  const filters = [
    {
      key: "all",
      label: "All",
      icon: "",
    },
    {
      key: "fraud",
      label: "Fraud",
      icon: "🚨",
    },
    {
      key: "safe",
      label: "Safe",
      icon: "✅",
    },
    {
      key: "highrisk",
      label: "High Risk",
      icon: "⚠️",
    },
  ];

  return (
    <div className="fg-transaction-filter">
      {filters.map((filter) => (
        <button
          key={filter.key}
          type="button"
          className={`fg-transaction-filter-button ${
            activeFilter === filter.key ? "active" : ""
          }`}
          onClick={() => onFilter(filter.key)}
        >
          {filter.icon && (
            <span className="fg-transaction-filter-icon">
              {filter.icon}
            </span>
          )}

          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default TransactionFilter;