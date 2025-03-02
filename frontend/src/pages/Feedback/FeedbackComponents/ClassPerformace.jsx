import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import yoga from "../../../assets/yoga.jpg";
import ViewClassPopup from "./ViewClassPopup";
function createData(
  classID,
  className,
  classDate,
  classStartTime,
  classEndTime,
  avgRating,
  ratingAmount
) {
  return {
    classID,
    className,
    classDate,
    classStartTime,
    classEndTime,
    avgRating,
    ratingAmount,
  };
}

const rows = [
  createData("C001", "Yoga", "Jan 20, 2025", "8:00AM", "9:00AM", 3.0, 10),
  createData("C002", "Zumba", "Feb 15, 2025", "10:00AM", "11:00AM", 4.5, 18),
  createData("C003", "JZumba", "Mar 10, 2025", "1:00PM", "2:00PM", 5.0, 25),
  createData("C004", "Michaedsad", "Apr 5, 2025", "3:00PM", "4:00PM", 4.8, 20),
  createData(
    "C005",
    "Chris Brown",
    "May 22, 2025",
    "6:00PM",
    "7:00PM",
    3.9,
    12
  ),
];

export default function ClassPerformance() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [selectedClass, setSelectedClass] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (row) => {
    setSelectedClass(row);
    setOpenDialog(true);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="class performance table">
          <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
            <TableRow>
              <TableCell sx={{ textAlign: "left" }}>Class ID</TableCell>
              <TableCell align="left">Class</TableCell>
              <TableCell align="center" sx={{ width: 200 }}>
                Average Rating
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow
                  key={row.classID}
                  onClick={() => handleRowClick(row)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <TableCell>{row.classID}</TableCell>
                  <TableCell sx={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={yoga}
                      alt="class pic"
                      style={{
                        width: "75px",
                        height: "75px",
                        marginRight: "12px",
                        borderRadius: "8px",
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      <span style={{ fontWeight: "550", fontSize: "16px" }}>
                        {row.className}
                      </span>
                      <span style={{ color: "#666", fontSize: "14px" }}>
                        {row.classDate}
                      </span>
                      <span style={{ color: "#666", fontSize: "14px" }}>
                        {row.classStartTime} - {row.classEndTime}
                      </span>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: "35px",
                          textAlign: "right",
                          fontWeight: 600,
                        }}
                      >
                        {row.avgRating.toFixed(1)}
                      </Box>
                      <Rating
                        value={row.avgRating}
                        precision={0.5}
                        readOnly
                        emptyIcon={
                          <StarIcon
                            style={{ opacity: 0.55 }}
                            fontSize="inherit"
                          />
                        }
                      />
                      <Box
                        sx={{
                          minWidth: "35px",
                          textAlign: "left",
                          fontWeight: 500,
                          color: "#6b6b6b",
                        }}
                      >
                        ({row.ratingAmount})
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[2, 4, 6]}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <ViewClassPopup
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        selectedClass={selectedClass}
      />
    </>
  );
}
