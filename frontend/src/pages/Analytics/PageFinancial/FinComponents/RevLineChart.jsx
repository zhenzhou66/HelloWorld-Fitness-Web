import React from "react";
import { Line } from "react-chartjs-2";
import classes from "../Financial.module.css";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

import ChartInfo from "./ChartInfo";
import YearSelectBox from "./YearSelectBox";
import { useState } from "react";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function RevLineChart() {
  const [selectedYear, setSelectedYear] = useState("2024");

  const handleYearChange = (newSelectedYear) => {
    setSelectedYear(newSelectedYear);
    console.log("Selected Year:", newSelectedYear); // You can now use this value anywhere
  };
  const data = {
    labels: [
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
    ],
    datasets: [
      {
        label: "Revenue",
        data: [12, 19, 3, 5, 2, 3, 9, 10, 15, 20, 25, 30],
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };
  return (
    <div className={classes.upperSection}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <ChartInfo
          title="Revenue"
          amount="875.00"
          description="avg per month"
        />

        <YearSelectBox onYearChange={handleYearChange} />
      </div>

      <div className={classes.chart}>
        <Line data={data} options={options} style={{ height: "250px" }}></Line>
      </div>
    </div>
  );
}

export default RevLineChart;
