import React, { useState, useEffect } from "react";
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
import ViewTrainerPopup from "./ViewTrainerPopup";

export default function TrainerPerformance() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(2);
  const [selectedClass, setSelectedClass] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRow] = useState([]);
  
  useEffect(() => {
    fetch("http://localhost:5000/api/feedback/displayTrainerRating")
      .then((response) => response.json())
      .then((data) => {
        setRow(data.trainerFeedback);
      })
      .catch((error) => console.error("Error fetching stats:", error));
  }, []);

  // Pagination Actions Component
  function getLabelText(value) {
    return value.toFixed(1);
  }

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
              Trainer ID
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
              key={row.user_id}
              onClick={() => handleRowClick(row)}
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              <TableCell sx={{ textAlign: "left", verticalAlign: "middle" }}>
                {row.user_id}
              </TableCell>
              <TableCell
                sx={{
                  display: "flex",
                  alignItems: "center",
                  verticalAlign: "middle",
                }}
              >
                <img
                  src={`http://localhost:5000/uploads/${row.profile_picture}`}
                  alt="trainer pic"
                  style={{
                    width: "60px",
                    height: "60px",
                    marginRight: "12px",
                    borderRadius: "50px",
                    objectFit: "cover",
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
                    {row.email}
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
                    {getLabelText(parseFloat(row.avgRating) || 0)}
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
