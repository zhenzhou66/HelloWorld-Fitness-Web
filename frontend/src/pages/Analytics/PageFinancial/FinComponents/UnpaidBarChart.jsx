import React from "react";
import classes from "../Financial.module.css";
import ChartInfo from "./ChartInfo";
import YearSelectBox from "./YearSelectBox";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);
function UnpaidBarChart() {
  const [selectedYear, setSelectedYear] = useState("2024");

  const handleYearChange = (newSelectedYear) => {
    setSelectedYear(newSelectedYear);
    console.log("Selected Year:", newSelectedYear); //use this newSelectedYear for backend
  };
  const data = {
    labels: ["Paid", "Unpaid"],
    datasets: [
      {
        label: "Membership",
        data: [12, 19], //bar chart edit data here
        fill: false,
        backgroundColor: ["rgba(0, 200, 0, 0.6)", "rgba(255, 0, 0, 0.6)"],
        borderColor: ["rgba(0, 150, 0, 1)", "rgba(200, 0, 0, 1)"],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
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
    <div className={classes.midRightSection}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          width: "100%",
        }}
      >
        <ChartInfo
          title="Membership Payment Status"
          amount="1000"
          description="Unpaid"
        />
        <YearSelectBox onYearChange={handleYearChange} />
      </div>
      <div>
        <Bar data={data} options={options} style={{ height: "250px" }}></Bar>
      </div>
    </div>
  );
}

export default UnpaidBarChart;
