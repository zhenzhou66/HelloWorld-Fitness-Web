import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";

function YearSelectBox({ onYearChange }) {
  // Accept a prop function
  const [selectedYear, setSelectedYear] = useState("2024");

  const handleChange = (e) => {
    setSelectedYear(e.target.value);
    onYearChange(e.target.value); // Call parent function with the new year
  };

  return (
    <div style={{ marginLeft: "25px", marginRight: "25px" }}>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="YearRevenue">Year</InputLabel>
          <Select
            labelId="YearRevenue"
            id="year-select"
            value={selectedYear}
            label="Year"
            onChange={handleChange}
          >
            <MenuItem value="2023">2023</MenuItem>
            <MenuItem value="2024">2024</MenuItem>
            <MenuItem value="2025">2025</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </div>
  );
}

export default YearSelectBox;
