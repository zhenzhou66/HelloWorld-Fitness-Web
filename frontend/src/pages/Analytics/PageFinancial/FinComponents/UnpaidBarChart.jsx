import React from "react";
import classes from "../Financial.module.css";
import ChartInfo from "./ChartInfo";
import YearSelectBox from "./YearSelectBox";
import { useState, useEffect } from "react";
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
  const [selectedYear, setSelectedYear] = useState("2025");
  const [graphData, setGraphData] = useState([]);
    
  useEffect(() => {
    fetch(`http://localhost:5000/api/analytics/paymentStatus/${selectedYear}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        if (!data.paymentStatus || data.paymentStatus.length === 0) {
          setGraphData([{ Paid: 0, Unpaid: 0 }]); 
        } else {
          setGraphData(data.paymentStatus);
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [selectedYear]);

  const handleYearChange = (newSelectedYear) => {
    setSelectedYear(newSelectedYear);
  };

  const data = {
    labels: ["Paid", "Unpaid"],
    datasets: [
      {
        label: "Membership",
        data: graphData, //bar chart edit data here
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
          amount={graphData.Unpaid}
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
