import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import {
  getTodayStats,
  getMonthStats,
  getYearlyStats,
} from "../../api/admin";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

const FraudChart = ({ activeFilter }) => {
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

  const labels =
    chartData.length > 0
      ? chartData.map(
          (d) => d.label || d.date || d.month || ""
        )
      : activeFilter === "today"
      ? Array.from(
          { length: 24 },
          (_, i) => `${i}:00`
        )
      : activeFilter === "month"
      ? Array.from(
          { length: 30 },
          (_, i) => `${i + 1}`
        )
      : [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

  const fraudCounts =
    chartData.length > 0
      ? chartData.map((d) =>
          d.fraud !== undefined
            ? d.fraud
            : d.count || 0
        )
      : new Array(labels.length).fill(0);

  const allZero = fraudCounts.every(
    (c) => c === 0
  );

  const chartTitle = () => {
    if (activeFilter === "today") {
      return "Today's Fraud (Hourly)";
    }

    if (activeFilter === "month") {
      return "This Month's Fraud (Daily)";
    }

    if (activeFilter === "year") {
      return "This Year's Fraud (Monthly)";
    }

    return "Fraud Transactions";
  };

  const lineData = {
    labels,

    datasets: [
      {
        label: "Fraud Transactions",
        data: fraudCounts,

        borderColor: "#dc3545",
        backgroundColor: "rgba(220, 53, 69, 0.08)",

        tension: 0.4,
        fill: true,

        pointRadius: allZero ? 0 : 5,

        pointBackgroundColor: "#dc3545",
        pointBorderColor: "white",
        pointBorderWidth: 2,

        borderWidth: 2.5,
      },
    ],
  };

  const options = {
    responsive: true,

    // Important for responsive dashboard
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top",

        labels: {
          usePointStyle: true,
          padding: 20,

          font: {
            size: 13,
          },
        },
      },

      tooltip: {
        backgroundColor: "#0F3D3E",
        titleColor: "white",
        bodyColor: "white",

        padding: 12,
        cornerRadius: 10,

        callbacks: {
          label: (context) =>
            ` Fraud: ${context.parsed.y}`,
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,

        max: allZero ? 5 : undefined,

        ticks: {
          stepSize: 1,
          color: "#66757A",

          font: {
            size: 12,
          },
        },

        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },

      x: {
        ticks: {
          color: "#66757A",

          font: {
            size: 11,
          },

          maxRotation: 45,
        },

        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="fg-chart-card">

      {/* Header */}

      <div className="fg-chart-header">

        <div>
          <h3 className="fg-chart-title">
            {chartTitle()}
          </h3>

          <p className="fg-chart-subtitle">
            Fraud transaction trends
          </p>
        </div>

        {allZero && (
          <span className="fg-chart-status">
            ✓ No Fraud Detected
          </span>
        )}

      </div>


      {/* Chart */}

      <div className="fg-line-chart-container">

        {loading ? (
          <div className="fg-chart-loading">

            <div className="fg-chart-loader"></div>

            <p>
              Loading chart data...
            </p>

          </div>
        ) : (
          <Line
            data={lineData}
            options={options}
          />
        )}

      </div>

    </div>
  );
};

export default FraudChart;