import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";

import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import LinearProgress from "@mui/material/LinearProgress";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function ViewTrainerPopup({ open, handleClose, selectedClass }) {
  if (!selectedClass) return null;

  // Hardcoded reviews
  const reviews = [
    {
      user: "AlexWu",
      rating: 5,
      comment:
        "The trainer was very motivating and gave clear instructions. The class was a bit crowded, though.",
    },
    {
      user: "James",
      rating: 5,
      comment:
        "Excellent class and trainer. The zumba session was well-paced and exciting.",
    },
    {
      user: "AlexWu",
      rating: 5,
      comment:
        "The trainer was very motivating and gave clear instructions. The class was a bit crowded, though.",
    },
  ];

  // Hardcoded rating breakdown
  const ratingBreakdown = [
    { stars: 5, count: 4 },
    { stars: 4, count: 3 },
    { stars: 3, count: 3 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      sx={{ maxHeight: "none" }}
    >
      <DialogTitle
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "50px",
          backgroundColor: "#f9f9f9",
          marginTop: "10px",
        }}
      >
        {/* Title */}

        <Typography variant="h5" fontWeight="bold">
          View Trainer Performance
        </Typography>

        <IconButton onClick={handleClose} sx={{ color: "black" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3, backgroundColor: "#f9f9f9" }}>
        {/* Class Profile (Edit class image here) */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Avatar
            src="/path-to-avatar.jpg" // <------ Class image here
            sx={{ width: 60, height: 60, mr: 2 }}
          />
          <Box>
            <Typography variant="body2" color="textSecondary">
              Class Name
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {selectedClass.username}
            </Typography>
          </Box>
          <div
            style={{
              display: "flex",
              marginLeft: "auto",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ fontWeight: "600", alignSelf: "flex-end" }}>
              ID: {selectedClass.userID}
            </Typography>
          </div>
        </Box>

        {/* Rating Overview */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Rating overview
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
            <Typography variant="h4" fontWeight="bold">
              {selectedClass.avgRating.toFixed(1)}
            </Typography>
            <Rating
              value={selectedClass.avgRating}
              precision={0.5}
              readOnly
              sx={{ ml: 1 }}
            />
            <Typography variant="body2" sx={{ ml: 1, color: "gray" }}>
              {selectedClass.ratingAmount} ratings
            </Typography>
          </Box>

          {/* Star Breakdown */}
          {ratingBreakdown.map(({ stars, count }) => (
            <Box
              key={stars}
              sx={{ display: "flex", alignItems: "center", mt: 1 }}
            >
              <Typography sx={{ color: "#F4B508", minWidth: 20 }}>
                {stars} ★
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(count / 5) * 100} // wanyin the 20 is here is total rating, but u can make it dynamic
                sx={{
                  marginLeft: "10px",
                  flexGrow: 1,
                  height: 8,
                  backgroundColor: "#ddd",
                  "& .MuiLinearProgress-bar": { backgroundColor: "#E5843A" },
                }}
              />
              <Typography sx={{ minWidth: 30, textAlign: "right", ml: 1 }}>
                {count}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Reviews Section */}
        <Box sx={{ mt: 3, maxHeight: "200px", overflowY: "auto" }}>
          {reviews.map((review, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography fontWeight="bold">{review.user}</Typography>
              <Rating value={review.rating} readOnly sx={{ fontSize: 18 }} />
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {review.comment}
              </Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
