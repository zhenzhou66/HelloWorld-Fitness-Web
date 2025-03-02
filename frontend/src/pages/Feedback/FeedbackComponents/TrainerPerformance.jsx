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
import ViewTrainerPopup from "./ViewTrainerPopup";

// Pagination Actions Component

function getLabelText(value) {
  return value.toFixed(1);
}

function createData(userID, username, userEmail, avgRating, ratingAmount) {
  return { userID, username, userEmail, avgRating, ratingAmount };
}

const rows = [
  createData("U001", "Emily Lai", "emilylai2006@gmail.com", 3.0, 10),
  createData("U002", "Emilia Lai", "emilylai2005@gmail.com", 4.5, 15),
  createData("U003", "John Doe", "johndoe@example.com", 4.2, 12),
  createData("U004", "Jane Smith", "janesmith@example.com", 3.8, 9),
  createData("U005", "Michael Lee", "michaellee@example.com", 4.7, 20),
  createData("U006", "Chris Brown", "chrisbrown@example.com", 3.9, 11),
];

export default function TrainerPerformance() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(2);
  const [selectedClass, setSelectedClass] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="trainer performance table">
        <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
          <TableRow>
            <TableCell sx={{ textAlign: "left", verticalAlign: "middle" }}>
              User ID
            </TableCell>
            <TableCell align="left" sx={{ verticalAlign: "middle" }}>
              Username
            </TableCell>
            <TableCell
              sx={{ textAlign: "center", verticalAlign: "middle", width: 200 }}
            >
              Average Rating
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow
              key={row.userID}
              onClick={() => handleRowClick(row)}
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              <TableCell sx={{ textAlign: "left", verticalAlign: "middle" }}>
                {row.userID}
              </TableCell>
              <TableCell
                sx={{
                  display: "flex",
                  alignItems: "center",
                  verticalAlign: "middle",
                }}
              >
                <img
                  src={yoga}
                  alt="trainer pic"
                  style={{
                    width: "60px",
                    height: "60px",
                    marginRight: "12px",
                    borderRadius: "50px",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <span style={{ fontWeight: "550", fontSize: "16px" }}>
                    {row.username}
                  </span>
                  <span style={{ color: "#666", fontSize: "14px" }}>
                    {row.userEmail}
                  </span>
                </div>
              </TableCell>
              <TableCell align="center" sx={{ verticalAlign: "middle" }}>
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
                    {getLabelText(row.avgRating)}
                  </Box>
                  <Rating
                    name="read-only"
                    value={row.avgRating}
                    precision={0.5}
                    getLabelText={(value) => getLabelText(value)}
                    readOnly
                    emptyIcon={
                      <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
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
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={3} />
            </TableRow>
          )}
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
        <ViewTrainerPopup
          open={openDialog}
          handleClose={() => setOpenDialog(false)}
          selectedClass={selectedClass}
        />
      </Table>
    </TableContainer>
  );
}
