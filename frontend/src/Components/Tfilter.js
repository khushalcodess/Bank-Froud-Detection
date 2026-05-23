import React from 'react';

const Tfilter = ({ activeFilter, onFilter }) => {

  //  Button style based on active state
  const btnStyle = (filter) => ({
    color: activeFilter === filter ? "white" : "#0F3D3E",
    backgroundColor: activeFilter === filter ? "#0F3D3E" : "white",
    height: "40px",
    width: "120px",
    borderRadius: "20px",
    border: "1px solid #0F3D3E",
    cursor: "pointer",
    fontWeight: activeFilter === filter ? "500" : "400",
    transition: "all 0.2s"
  });

  return (
    <div className='d-flex justify-content-evenly m-5'>

      <button
        style={btnStyle("all")}
        onClick={() => onFilter("all")}
      >
        All
      </button>

      <button
        style={btnStyle("fraud")}
        onClick={() => onFilter("fraud")}
      >
        🚨 Fraud
      </button>

      <button
        style={btnStyle("safe")}
        onClick={() => onFilter("safe")}
      >
        ✅ Safe
      </button>

      <button
        style={btnStyle("highrisk")}
        onClick={() => onFilter("highrisk")}
      >
        ⚠️ High Risk
      </button>

    </div>
  );
};

export default Tfilter;