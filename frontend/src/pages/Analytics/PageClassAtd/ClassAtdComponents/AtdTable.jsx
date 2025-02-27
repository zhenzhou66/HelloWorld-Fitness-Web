import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import yoga from "../../../../assets/yoga.jpg";
import {useState, useEffect} from "react";

// function createData(
//   classID,
//   className,
//   classPic,
//   classDesc,
//   schDate,
//   time,
//   assignedTrainer,
//   attendanceRate,
//   absentees
// ) {
//   return {
//     classID,
//     className,
//     classPic,
//     classDesc,
//     schDate,
//     time,
//     assignedTrainer,
//     attendanceRate,
//     absentees,
//   };
// }

// const rows = [
//   createData(
//     "001",
//     "Yoga Flow",
//     { yoga },
//     "A gentle flow class that focuses on linking breath with movement.",
//     "Jan 20 2025",
//     "8:00AM - 9:00AM",
//     "AlexW",
//     "100%",
//     "0"
//   ),
// ];

export default function BasicTable() {

  const [rows, setRows] = useState([]);
  
  useEffect(() => {
    fetch("http://localhost:5000/api/analytics/classPopularity")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        setRows(data.classInfo); 
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell component="th" scope="row">
              Class ID
            </TableCell>
            <TableCell component="th" scope="row">
              Class Name
            </TableCell>
            <TableCell align="right">Schedule Date</TableCell>
            <TableCell align="right">Class Time</TableCell>
            <TableCell align="right">Trainer</TableCell>
            <TableCell align="right">Attendance Rate</TableCell>
            <TableCell align="right">Absentees</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.class_id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.class_id}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                style={{ display: "flex", alignItems: "center" }}
              >
                <img
                  src={`http://localhost:5000/uploads/${row.class_image}`}
                  alt="class pic"
                  style={{
                    width: "75px",
                    height: "75px",
                    marginRight: "12px",
                    borderRadius: "8px",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    {row.class_name}
                  </span>
                  <span style={{ color: "#666", fontSize: "14px" }}>
                    {row.description}
                  </span>
                </div>
              </TableCell>
              <TableCell align="right">{new Date(row.schedule_date).toISOString().split('T')[0]}</TableCell>
              <TableCell align="right">{row.start_time} - {row.end_time}</TableCell>
              <TableCell align="right">{row.trainer_id}</TableCell>
              <TableCell align="right">{row.present_count / row.total * 100}%</TableCell>
              <TableCell align="right">{row.absent_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
