import React, { useState, useEffect } from "react";
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
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import classes from "../ClassAtd.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

function PopChart() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const data = {
    labels: ["Yoga", "HIIT", "Spin", "Zumba"],
    datasets: [
      {
        label: "Active Members",
        data: [12, 19, 3, 5],
        fill: false,
        backgroundColor: "rgba(248, 215, 174, 0.4)",
        borderColor: "rgb(0, 0, 0)",
        borderWidth: 1,
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
    <div className={classes.leftsection}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h2 style={{ marginLeft: "25px", fontSize: "20px", fontWeight: "550" }}>
          Class Popularity
        </h2>
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

      <div>
        <Bar data={data} options={options} style={{ height: "250px" }}></Bar>
      </div>
    </div>
  );
}

export default PopChart;
