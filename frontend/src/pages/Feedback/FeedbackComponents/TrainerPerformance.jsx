import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";

function getLabelText(value) {
  return value.toFixed(1);
}

function createData(userID, username, avgRating, ratingAmount) {
  return { userID, username, avgRating, ratingAmount };
}

const rows = [
  createData("U001", "Emily Lai", 3.0, 10),
  createData("U002", "Emilia Lai", 4.5, 15),
];

export default function TrainerPerformance() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell align="left">Username</TableCell>
            <TableCell align="center" sx={{ width: 200 }}>
              Average Rating
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.userID}
              </TableCell>
              <TableCell align="left">{row.username}</TableCell>
              <TableCell align="center">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 200,
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
        </TableBody>
      </Table>
    </TableContainer>
  );
}
