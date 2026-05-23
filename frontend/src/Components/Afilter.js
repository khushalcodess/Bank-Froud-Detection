import React from 'react';

const Afilter = ({ activeFilter, onFilter }) => {

  const btnStyle = (filter, color) => ({
    color: activeFilter === filter ? "white" : color,
    backgroundColor: activeFilter === filter ? color : "white",
    height: "40px",
    width: "200px",
    borderRadius: "20px",
    border: `1px solid ${color}`,
    cursor: "pointer",
    fontWeight: activeFilter === filter ? "500" : "400",
    transition: "all 0.2s"
  });

  return (
    <div className='d-flex justify-content-evenly m-4'>
      <button
        style={btnStyle("all", "#0F3D3E")}
        onClick={() => onFilter("all")}
      >
        All Alerts
      </button>
      <button
        style={btnStyle("highrisk", "#c81c1c")}
        onClick={() => onFilter("highrisk")}
      >
        🔴 High Risk
      </button>
      <button
        style={btnStyle("suspicious", "#d97415")}
        onClick={() => onFilter("suspicious")}
      >
        🟡 Suspicious Activity
      </button>
      <button
        style={btnStyle("multiple", "#7b2fbf")}
        onClick={() => onFilter("multiple")}
      >
        🔁 Multiple Transactions
      </button>
    </div>
  );
};

export default Afilter;