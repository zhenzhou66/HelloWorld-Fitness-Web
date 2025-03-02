import React, {useState, useEffect} from "react";
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
  const [ratingBreakdown, setRatingBreakdown] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/feedback/trainerFeedbackDetails/${selectedClass.user_id}`)
      .then((response) => response.json())
      .then((data) => {
        setRatingBreakdown(data.ratingBreakdown);
        setReviews(data.feedbackDetail);
      })
      .catch((error) => console.error("Error fetching stats:", error));
  }, [open, selectedClass?.user_id]);

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
        {/* Trainer Profile (Edit trainer image here) */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Avatar
            src={`http://localhost:5000/uploads/${selectedClass.profile_picture}`} // <------ Trainer image here
            sx={{ width: 60, height: 60, mr: 2 }}
          />
          <Box>
            <Typography variant="body2" color="textSecondary">
              Trainer Name
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {selectedClass.name}
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
              ID: {selectedClass.user_id}
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
              {parseFloat(selectedClass.avgRating).toFixed(1) || 0}
            </Typography>
            <Rating
              value={parseFloat(selectedClass.avgRating)}
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
                value={(count / 5) * 100} 
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
              <Typography fontWeight="bold">{review.name}</Typography>
              <Rating value={review.trainer_rating} readOnly sx={{ fontSize: 18 }} />
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {review.comments}
              </Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
