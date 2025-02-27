import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import classes from "../Financial.module.css";
import ChartInfo from "./ChartInfo";
import YearSelectBox from "./YearSelectBox";
import { useState, useEffect } from "react";
ChartJS.register(ArcElement, Tooltip, Legend);
function RevPieChart() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [graphDataY, setGraphDataY] = useState([]);
  const [graphDataX, setGraphDataX] = useState([]);
  const [sumRevenue, setSumRevenue] = useState("0.00");

  useEffect(() => {
    fetch(`http://localhost:5000/api/analytics/revenuePieChart/${selectedYear}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        if (!data || !data.category || data.category.length === 0) {
          // Handle empty dataset
          setGraphDataY([]);
          setGraphDataX([]);
          setSumRevenue("0.00");
        } else {
          setGraphDataY(data.category.map((item) => item.description));
          setGraphDataX(data.category.map((item) => item.amount || 0)); // Ensure amount is not undefined
          setSumRevenue(parseFloat(data.sumRevenue || 0).toFixed(2)); // Ensure valid number
        }
      })
      .catch((error) => {
        console.error(error.message);
        setGraphDataY([]);
        setGraphDataX([]);
        setSumRevenue("0.00"); // Default to 0.00 on error
      });
  }, [selectedYear]);

  // Function to generate random colors
  const generateRandomColors = (numColors) => {
    return Array.from({ length: numColors }, (_, i) => {
      const hue = (360 / numColors) * i; 
      return `hsl(${hue}, 70%, 60%)`;
    });
  };

  // Generate colors based on the number of categories
  const colors = generateRandomColors(graphDataY.length);

  const handleYearChange = (newSelectedYear) => {
    setSelectedYear(newSelectedYear);
  };
  const data = {
    labels: graphDataY,
    datasets: [
      {
        data: graphDataX,
        backgroundColor: colors,
        borderColor: colors.map((color) => color.replace("60%", "40%")), 
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
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "10px",
          width: "100%",
        }}
      >
        <ChartInfo
          title="Revenue Breakdown"
          amount={sumRevenue}
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
