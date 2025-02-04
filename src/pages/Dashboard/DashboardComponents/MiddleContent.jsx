import React, { useState } from "react";
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
import TAM2024 from "./TAM2024.json";
import TAM2025 from "./TAM2025.json";
import TAMempty from "./TAMempty.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

const dataSets = { 2024: TAM2024, 2025: TAM2025 };

const MiddleContent = () => {
  const [selectedYear, setSelectedYear] = useState("2024");

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const chartData = dataSets[selectedYear] || TAMempty;

  return (
    <div className={classes.MiddleContent} style={{ height: "350px" }}>
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
                onChange={handleYearChange}
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
                <MenuItem value={"2023"}>2023</MenuItem>
                <MenuItem value={"2024"}>2024</MenuItem>
                <MenuItem value={"2025"}>2025</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
      </div>
      <div style={{ width: "80vw", marginLeft: "20px", overflowX: "auto" }}>
        <Bar
          data={{
            labels: chartData.map((data) => data.label),
            datasets: [
              {
                label: "Total Active Members",
                data: chartData.map((data) => data.Amount),
                backgroundColor: "rgba(247, 220, 220, 0.4)",
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
          style={{ height: "400px" }}
        />
      </div>
    </div>
  );
};

export default MiddleContent;
