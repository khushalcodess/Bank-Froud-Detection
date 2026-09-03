import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

const StatCard = ({ title, value, percent, color }) => {
  const data = {
    datasets: [
      {
        data: [percent, 100 - percent],
        backgroundColor: [color, "#eaeaea"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "75%",
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="fg-stat-card">
      <div className="fg-stat-card-content">
        <div className="fg-stat-card-info">
          <p className="fg-stat-card-title">{title}</p>

          <h2 className="fg-stat-card-value">
            {value}
          </h2>

          <span className="fg-stat-card-percent">
            {percent}% of total
          </span>
        </div>

        <div className="fg-stat-card-chart">
          <Doughnut data={data} options={options} />

          <span className="fg-stat-card-chart-value">
            {percent}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;