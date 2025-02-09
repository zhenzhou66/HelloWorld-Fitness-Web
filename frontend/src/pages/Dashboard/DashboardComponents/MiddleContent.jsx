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
import classes from "../Dashboard.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

const getAvailableYears = () => {
  const currentYear = new Date().getFullYear();
  return [currentYear - 2, currentYear - 1, currentYear];
};

const MiddleContent = () => {
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/dashboard/active-members/${selectedYear}`)
      .then((response) => response.json())
      .then((data) => setChartData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [selectedYear]);

  return (
    <div className={classes.MiddleContent}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h2 style={{ marginLeft: "25px", fontSize: "20px" }}>
          Total Active Members | {selectedYear}
        </h2>
        <div style={{ marginLeft: "25px", marginRight: "25px" }}>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="YearTAM">Year</InputLabel>
              <Select
                labelId="YearTAM"
                id="year-select"
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "red", // Default border color
                    },
                    "&:hover fieldset": {
                      borderColor: "#dcdcdc", // Border color when hovered
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ff7f7f", // Border color when focused
                    },
                  },
                }}
              >
                {getAvailableYears().map((year) => (
                  <MenuItem key={year} value={year.toString()}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>
      <div style={{ width: "70vw", marginLeft: "20px", overflowX: "auto" }}>
        <Bar
          data={{
            labels: chartData.map((data) => data.label),
            datasets: [
              {
                label: "Total Active Members",
                data: chartData.map((data) => data.Amount),
                backgroundColor: "rgba(248, 215, 174, 0.4)",
                borderColor: "rgb(0, 0, 0)",
                borderWidth: 1,
              },
            ],
          }}
          options={{
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
          }}
          style={{ width: "65%", height: "400px" }}
        />
      </div>
    </div>
  );
};

export default MiddleContent;
