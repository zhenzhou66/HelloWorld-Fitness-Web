import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import classes from "../Financial.module.css";
import ChartInfo from "./ChartInfo";
import YearSelectBox from "./YearSelectBox";
import { useState } from "react";
ChartJS.register(ArcElement, Tooltip, Legend);
function RevPieChart() {
  const [selectedYear, setSelectedYear] = useState("2024");

  const handleYearChange = (newSelectedYear) => {
    setSelectedYear(newSelectedYear);
    console.log("Selected Year:", newSelectedYear); // You can now use this value anywhere
  };
  const data = {
    labels: [
      "PremiumYearly",
      "StandardYearly",
      "StandardMonthly",
      "PremiumMonthly",
    ],
    datasets: [
      {
        data: [25000, 10000, 5000, 3000],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
    },
  };
  return (
    <div className={classes.midLeftSection}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between", // ✅ Ensures spacing
          alignItems: "center",
          marginBottom: "10px",
          width: "100%",
        }}
      >
        <ChartInfo
          title="Revenue Breakdown"
          amount="10500.00"
          description="Total"
        />
        <YearSelectBox onYearChange={handleYearChange} />
      </div>

      <div className={classes.pieContainer}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

export default RevPieChart;
