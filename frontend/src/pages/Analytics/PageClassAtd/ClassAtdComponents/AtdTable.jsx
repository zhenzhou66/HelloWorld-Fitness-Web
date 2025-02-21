import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(
  classID,
  className,
  schDate,
  time,
  assignedTrainer,
  attendanceRate,
  absentees
) {
  return {
    classID,
    className,
    schDate,
    time,
    assignedTrainer,
    attendanceRate,
    absentees,
  };
}

const rows = [
  createData(
    "001",
    "Yoga Flow",
    "Jan 20 2025",
    "8:00AM - 9:00AM",
    "AlexW",
    "100%",
    "0"
  ),
];

export default function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell component="th" scope="row">
              Class ID
            </TableCell>
            <TableCell align="right">Class Name</TableCell>
            <TableCell align="right">Schedule Date</TableCell>
            <TableCell align="right">Time</TableCell>
            <TableCell align="right">Trainer</TableCell>
            <TableCell align="right">Attendance Rate</TableCell>
            <TableCell align="right">Absentees</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.classID}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.classID}
              </TableCell>
              <TableCell align="right">{row.className}</TableCell>
              <TableCell align="right">{row.schDate}</TableCell>
              <TableCell align="right">{row.time}</TableCell>
              <TableCell align="right">{row.assignedTrainer}</TableCell>
              <TableCell align="right">{row.attendanceRate}</TableCell>
              <TableCell align="right">{row.absentees}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
