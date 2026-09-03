import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Piechart = ({
  safe = 0,
  suspicious = 0,
  flagged = 0,
}) => {
  const total = safe + suspicious + flagged;

  // Show a placeholder chart when there are no transactions
  const chartSafe = total === 0 ? 1 : safe;
  const chartSuspicious = total === 0 ? 0 : suspicious;
  const chartFlagged = total === 0 ? 0 : flagged;

  const allSafe =
    total > 0 &&
    suspicious === 0 &&
    flagged === 0;

  const data = {
    labels: ["Safe", "Suspicious", "Flagged"],
    datasets: [
      {
        data: [
          chartSafe,
          chartSuspicious,
          chartFlagged,
        ],
        backgroundColor: [
          "#0F3D3E",
          "#f39c12",
          "#dc3545",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",

    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 18,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },

      tooltip: {
        callbacks: {
          label: (context) => {
            if (total === 0) {
              return " No transactions yet";
            }

            const value = context.parsed;
            const percent = ((value / total) * 100).toFixed(1);

            return ` ${context.label}: ${value} (${percent}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="fg-pie-card">

      {/* Header */}
      <div className="fg-pie-header">
        <div>
          <h3 className="fg-pie-title">
            Fraud vs Safe Transactions
          </h3>

          <p className="fg-pie-subtitle">
            Transaction risk distribution
          </p>
        </div>

        {(total === 0 || allSafe) && (
          <span className="fg-pie-status">
            All Safe
          </span>
        )}
      </div>

      {/* Chart */}
      <div className="fg-pie-chart-container">
        <Doughnut
          data={data}
          options={options}
        />
      </div>

      {/* Summary */}
      <div className="fg-pie-summary">

        <div className="fg-pie-summary-item">


          <div>
            <p className="fg-pie-summary-label">
              Safe
            </p>

            <p className="fg-pie-summary-value safe">
              {safe}
            </p>
          </div>
        </div>

        <div className="fg-pie-summary-item">


          <div>
            <p className="fg-pie-summary-label">
              Suspicious
            </p>

            <p className="fg-pie-summary-value suspicious">
              {suspicious}
            </p>
          </div>
        </div>

        <div className="fg-pie-summary-item">
        

          <div>
            
            <p className="fg-pie-summary-label">
              Flagged
            </p>

            <p className="fg-pie-summary-value flagged">
              {flagged}
            </p>
          </div>
        </div>

      </div>

      {/* Empty state */}
      {total === 0 && (
        <p className="fg-pie-empty">
          No transactions yet — chart will update automatically.
        </p>
      )}

    </div>
  );
};

export default Piechart;