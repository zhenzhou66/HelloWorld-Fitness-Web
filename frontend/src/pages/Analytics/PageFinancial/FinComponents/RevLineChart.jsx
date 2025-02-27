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
import { useState, useEffect } from "react";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function RevLineChart() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [averageRevenue, setAverageRevenue] = useState("0.00");
  const [graphData, setGraphData] = useState([]);
  
  useEffect(() => {
    fetch(`http://localhost:5000/api/analytics/averageRevenue/${selectedYear}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        let monthlyData = new Array(12).fill(0);

        data.monthlyRevenue.forEach(({ month, amount }) => {
          monthlyData[month - 1] = amount; 
        });
  
        setGraphData(monthlyData);
        setAverageRevenue(parseFloat(data.averageRevenue).toFixed(2));      
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [selectedYear]);

  const handleYearChange = (newSelectedYear) => {
    setSelectedYear(newSelectedYear);
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
        data: graphData,
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
          amount={averageRevenue}
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
