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
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function RevLineChart() {
  const [selectedYear, setSelectedYear] = useState("2024");
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
        label: "Active Members",
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
        <h2 style={{ marginLeft: "25px", fontSize: "20px" }}>Revenue</h2>
        <p>$875</p>
        <div style={{ marginLeft: "25px", marginRight: "25px" }}>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="YearGymAtd">Year</InputLabel>
              <Select
                labelId="YearGymAtd"
                id="year-select"
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <MenuItem value="2023">2023</MenuItem>
                <MenuItem value="2024">2024</MenuItem>
                <MenuItem value="2025">2025</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>

      <div className={classes.chart}>
        <Line data={data} options={options} style={{ height: "250px" }}></Line>
      </div>
    </div>
  );
}

export default RevLineChart;
