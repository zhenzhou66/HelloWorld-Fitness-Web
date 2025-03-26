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
import ViewClassPopup from "./ViewClassPopup";

export default function ClassPerformance() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [selectedClass, setSelectedClass] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRow] = useState([]);
    
  useEffect(() => {
    fetch("http://localhost:5000/api/feedback/displayClassRating")
      .then((response) => response.json())
      .then((data) => {
        setRow(data.classFeedback);
      })
      .catch((error) => console.error("Error fetching stats:", error));
  }, []);

   // Formatting date function
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { timeZone: 'Asia/Kuala_Lumpur' }); 
  }

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
                  key={row.class_id}
                  onClick={() => handleRowClick(row)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <TableCell>{row.class_id}</TableCell>
                  <TableCell sx={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={`http://localhost:5000/uploads/${row.class_image}`}
                      alt="class pic"
                      style={{
                        width: "75px",
                        height: "75px",
                        marginRight: "12px",
                        borderRadius: "8px",
                        objectFit: "cover",

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
                        {row.class_name}
                      </span>
                      <span style={{ color: "#666", fontSize: "14px" }}>
                        {formatDate(row.schedule_date)}
                      </span>
                      <span style={{ color: "#666", fontSize: "14px" }}>
                        {row.start_time} - {row.end_time}
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
                        {parseFloat(row.avgRating).toFixed(1) || 0}
                      </Box>
                      <Rating
                        value={parseFloat(row.avgRating)}
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
