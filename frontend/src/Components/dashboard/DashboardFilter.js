import React from "react";

function DashboardFilter({ activeFilter, onFilterChange }) {
  const filters = [
    {
      value: "today",
      label: "Today",
    },
    {
      value: "month",
      label: "This Month",
    },
    {
      value: "year",
      label: "This Year",
    },
  ];

  return (
    <div className="fg-dashboard-filter">
      <div className="fg-filter-buttons">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={`fg-filter-button ${
              activeFilter === filter.value ? "active" : ""
            }`}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="fg-filter-label">
        Showing data for:{" "}
        <strong>
          {activeFilter === "today"
            ? "Today"
            : activeFilter === "month"
            ? "This Month"
            : "This Year"}
        </strong>
      </div>
    </div>
  );
}

export default DashboardFilter;