import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, LineElement, CategoryScale,
  LinearScale, PointElement, Tooltip, Legend
} from "chart.js";
import { getTodayStats, getMonthStats, getYearlyStats } from '../api/admin';

ChartJS.register(LineElement, CategoryScale, LinearScale,
  PointElement, Tooltip, Legend);

const FraudChart = ({ data = [], activeFilter }) => {

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        if (activeFilter === "today") {
          const res = await getTodayStats();
          setChartData(res.data.hours);
        } else if (activeFilter === "month") {
          const res = await getMonthStats();
          setChartData(res.data.days);
        } else if (activeFilter === "year") {
          const res = await getYearlyStats();
          setChartData(res.data.months);
        }
      } catch (err) {
        console.error("Chart fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, [activeFilter]);

  //  Extract labels
  const labels = chartData.length > 0
    ? chartData.map(d => d.label || d.date || d.month || "")
    : activeFilter === "today"
      ? Array.from({ length: 24 }, (_, i) => `${i}:00`)
      : activeFilter === "month"
        ? Array.from({ length: 30 }, (_, i) => `${i + 1}`)
        : ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  //  Extract fraud counts — always show 0s if no fraud
  const fraudCounts = chartData.length > 0
    ? chartData.map(d => d.fraud !== undefined ? d.fraud : d.count || 0)
    : new Array(labels.length).fill(0); //  zeros instead of empty

  //  Chart title based on filter
  const chartTitle = () => {
    if (activeFilter === "today") return "Today's Fraud (Hourly)";
    if (activeFilter === "month") return "This Month's Fraud (Daily)";
    if (activeFilter === "year") return "This Year's Fraud (Monthly)";
    return "Fraud Transactions";
  };

  //  Check if all zeros for subtitle message
  const allZero = fraudCounts.every(c => c === 0);

  const lineData = {
    labels,
    datasets: [
      {
        label: "Fraud Transactions",
        data: fraudCounts,
        borderColor: "#dc3545",
        backgroundColor: "rgba(220,53,69,0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: allZero ? 0 : 4, //  hide dots if all zero
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => `Fraud: ${context.parsed.y}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: allZero ? 5 : undefined, //  show scale even if all zero
        ticks: { stepSize: 1 }
      }
    }
  };

  return (
    <div style={{
      backgroundColor: "white",
      padding: "5%",
      paddingRight: "6%",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <div className='p-4 mt-2'>

        {/* Title + no fraud badge */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px"
        }}>
          <h5 style={{ color: "#0F3D3E", margin: 0 }}>{chartTitle()}</h5>

          {/*  Show green badge when no fraud */}
          {allZero && (
            <span style={{
              backgroundColor: "#d4edda",
              color: "#28a745",
              padding: "4px 12px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: "500"
            }}>
               No Fraud Detected
            </span>
          )}
        </div>

        {/*  Loading */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <div className="spinner-border" style={{ color: "#0F3D3E" }} />
            <p className="mt-2" style={{ color: "#0F3D3E" }}>Loading chart...</p>
          </div>
        ) : (
          //  Always show chart — never blank!
          <Line data={lineData} options={options} />
        )}

      </div>
    </div>
  );
};

export default FraudChart;