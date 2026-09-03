import React from "react";

const UserFilter = ({
  activeFilter,
  onFilter,
  searchQuery,
  onSearch,
}) => {
  const filters = [
    {
      key: "all",
      label: "All Users",
      icon: "",
    },
    {
      key: "active",
      label: "Active",
      icon: "✅",
    },
    {
      key: "blocked",
      label: "Blocked",
      icon: "🚫",
    },
  ];

  return (
    <div className="fg-user-filter">

      {/* Filter Buttons */}
      <div className="fg-user-filter-buttons">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            className={`fg-user-filter-button ${
              activeFilter === filter.key ? "active" : ""
            }`}
            onClick={() => onFilter(filter.key)}
          >
            {filter.icon && (
              <span className="fg-user-filter-icon">
                {filter.icon}
              </span>
            )}

            {filter.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="fg-user-search">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="fg-user-search-input"
        />
      </div>

    </div>
  );
};

export default UserFilter;