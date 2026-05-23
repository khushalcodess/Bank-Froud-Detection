import React from 'react';

const Ufilter = ({ activeFilter, onFilter, searchQuery, onSearch }) => {

  const btnStyle = (filter) => ({
    padding: "8px 20px",
    backgroundColor: activeFilter === filter ? "#0F3D3E" : "white",
    color: activeFilter === filter ? "white" : "#0F3D3E",
    border: "1px solid #0F3D3E",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: activeFilter === filter ? "500" : "400",
    transition: "all 0.2s",
    marginRight: "10px"
  });

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 50px",
      marginBottom: "20px",
      flexWrap: "wrap",
      gap: "10px"
    }}>

      {/* ✅ Filter Buttons */}
      <div>
        <button style={btnStyle("all")} onClick={() => onFilter("all")}>
          All Users
        </button>
        <button style={btnStyle("active")} onClick={() => onFilter("active")}>
          ✅ Active
        </button>
        <button style={btnStyle("blocked")} onClick={() => onFilter("blocked")}>
          🚫 Blocked
        </button>
      </div>

      {/* ✅ Search Box */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          style={{
            padding: "8px 15px",
            border: "1px solid #0F3D3E",
            borderRadius: "20px",
            outline: "none",
            width: "280px",
            fontSize: "14px"
          }}
        />
      </div>

    </div>
  );
};

export default Ufilter;