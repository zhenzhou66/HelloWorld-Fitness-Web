import React from "react";
import { Card, CardContent, Avatar, Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

// Dummy feedback data (sorted by most recent first)
const feedbackData = [
  {
    id: 1,
    user: "EmilyLai",
    date: "Mar 1, 2025",
    trainer: "AlexWu",
    className: "Yoga Flow",
    rating: 5,
    comment:
      "The trainer was very motivating and gave clear instructions. The class was a bit crowded, though.",
  },
  {
    id: 2,
    user: "EmilyLai",
    date: "Feb 28, 2025",
    trainer: "AlexWu",
    className: "Zumba",
    rating: 4,
    comment:
      "Excellent class and trainer. The Zumba session was well-paced and exciting.",
  },
  {
    id: 3,
    user: "EmilyLai",
    date: "Feb 25, 2025",
    trainer: "AlexWu",
    className: "Yoga Flow",
    rating: 3,
    comment:
      "The trainer was very motivating and gave clear instructions. The class was a bit crowded, though.",
  },
  {
    id: 4,
    user: "EmilyLai",
    date: "Feb 20, 2025",
    trainer: "AlexWu",
    className: "Pilates",
    rating: 5,
    comment: "Great class with an energetic vibe!",
  },
];

// Show only the latest 3 feedback items
const latestFeedback = feedbackData.slice(0, 3);

export default function LatestFeedback() {
  return (
    <Card
      sx={{
        padding: "16px",
        width: "100%",
        backgroundColor: "white",
        boxShadow: "none",
      }}
    >
      <h2
        style={{
          fontSize: "1.125rem",
          fontWeight: "600",
          marginBottom: "16px",
        }}
      >
        Latest Feedback
      </h2>
      {latestFeedback.map((feedback) => (
        <CardContent
          key={feedback.id}
          sx={{
            marginBottom: "16px",
            padding: "12px",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Avatar
              sx={{
                backgroundColor: "#e0e0e0",
                width: "40px",
                height: "40px",
              }}
            >
              {feedback.user.charAt(0)}
            </Avatar>
            <div>
              <p style={{ fontWeight: "600", margin: 0 }}>{feedback.user}</p>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#9e9e9e",
                  margin: 0,
                }}
              >
                {feedback.date}
              </p>
            </div>
          </div>
          <p
            style={{
              marginTop: "12px",
              fontSize: "0.875rem",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontWeight: "600" }}>{feedback.trainer}</span> -{" "}
            {feedback.className}
          </p>
          <Rating
            name="read-only"
            value={feedback.rating}
            precision={0.5}
            readOnly
            emptyIcon={
              <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
            }
          />
          <p
            style={{
              marginTop: "12px",
              fontSize: "0.875rem",
              color: "#616161",
            }}
          >
            {feedback.comment}
          </p>
        </CardContent>
      ))}
    </Card>
  );
}
