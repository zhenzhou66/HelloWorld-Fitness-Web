import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import classes from "../Financial.module.css";

function createData(paymentStatus, numOfTransct, totalAmount) {
  return { paymentStatus, numOfTransct, totalAmount };
}

const rows = [
  createData("Paid", 159, 6.0),
  createData("Overdue", 237, 9.0),
  createData("Pending", 262, 16.0),
];

function RevSourceTable() {
  const [startDate, setStartDate] = useState(null); //use this 2 for filter
  const [endDate, setEndDate] = useState(null);

  return (
    <div>
      <h3 style={{ marginBottom: "10px" }}>Payment Status Breakdown</h3>
      <div className={classes.datePickerContainer}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            className={classes.datePicker}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            className={classes.datePicker}
          />
        </LocalizationProvider>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Payment Status</TableCell>
              <TableCell align="center">Number of Transactions</TableCell>
              <TableCell align="left">Total Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.paymentStatus}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.paymentStatus}
                </TableCell>
                <TableCell align="center">{row.numOfTransct}</TableCell>
                <TableCell align="left">{row.totalAmount}$</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default RevSourceTable;
