import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Piechart = ({ safe = 0, suspicious = 0, flagged = 0 }) => {

  const total = safe + suspicious + flagged;

  //  If no data show default values so chart always visible
  const chartSafe = total === 0 ? 1 : safe;
  const chartSuspicious = total === 0 ? 0 : suspicious;
  const chartFlagged = total === 0 ? 0 : flagged;
  const allSafe = total > 0 && suspicious === 0 && flagged === 0;

  const data = {
    labels: ["Safe", "Suspicious", "Flagged"],
    datasets: [
      {
        data: [chartSafe, chartSuspicious, chartFlagged],
        backgroundColor: [
          "#0F3D3E",  // safe → dark green
          "#f39c12",  // suspicious → orange
          "#dc3545"   // flagged → red
        ],
        borderWidth: 0
      }
    ]
  };

  const options = {
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom"
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            // Show 0 in tooltip if no real data
            if (total === 0) return " No transactions yet";
            const value = context.parsed;
            const percent = ((value / total) * 100).toFixed(1);
            return ` ${context.label}: ${value} (${percent}%)`;
          }
        }
      }
    }
  };

 return (
  <div style={{
    backgroundColor: "white",
    padding: "6%",
    paddingTop: "8%",
    paddingBottom: "8%",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  }}>

    {/* Title + badge */}
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "20px",
      marginBottom: "15px",
      flexWrap: "wrap"
    }}>
      <h5 style={{ color: "#0F3D3E", margin: 0, textAlign: "center" }}>
        Fraud vs Safe Transactions
      </h5>
      {(total === 0 || allSafe) && (
        <span style={{
          backgroundColor: "#d4edda",
          color: "#28a745",
          padding: "3px 10px",
          borderRadius: "10px",
          fontSize: "12px",
          fontWeight: "500"
        }}>
          ✅ All Safe
        </span>
      )}
    </div>

    {/*  Size controlled here — change 200px to your preference */}
    <div style={{ width: "400px", height: "400px", margin: "0 auto" }}>
      <Doughnut data={data} options={options} />
    </div>

    {/* Summary below chart */}
    <div style={{
      display: "flex",
      justifyContent: "space-around",
      marginTop: "20px"
    }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Safe</p>
        <p style={{ margin: 0, fontWeight: "500", color: "#0F3D3E" }}>{safe}</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Suspicious</p>
        <p style={{ margin: 0, fontWeight: "500", color: "#f39c12" }}>{suspicious}</p>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Flagged</p>
        <p style={{ margin: 0, fontWeight: "500", color: "#dc3545" }}>{flagged}</p>
      </div>
    </div>

    {total === 0 && (
      <p style={{
        textAlign: "center",
        color: "#888",
        fontSize: "13px",
        marginTop: "15px"
      }}>
        No transactions yet — chart will update automatically
      </p>
    )}
  </div>
);
};

export default Piechart;