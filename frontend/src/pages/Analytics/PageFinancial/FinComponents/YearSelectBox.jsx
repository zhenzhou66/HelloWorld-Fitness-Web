import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";

function YearSelectBox({ onYearChange }) {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleChange = (e) => {
    setSelectedYear(e.target.value);
    onYearChange(e.target.value); //the changed year get passed into the prop
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
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </div>
  );  
}

export default YearSelectBox;
