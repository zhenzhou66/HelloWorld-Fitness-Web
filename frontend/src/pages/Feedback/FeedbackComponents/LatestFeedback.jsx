import React, {useState, useEffect} from "react";
import { Card, CardContent, Avatar, Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

export default function LatestFeedback() {

  //Displaying latest feedback
  const [feedback, setFeedback] = useState([]);
  
  useEffect(() => {
    fetch("http://localhost:5000/api/feedback/displayLatestFeedback")
      .then((response) => response.json())
      .then((data) => {
        setFeedback(data.feedback);
      })
      .catch((error) => console.error("Error fetching stats:", error));
  }, []);

  // Formatting date function
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { timeZone: 'Asia/Kuala_Lumpur' }); 
  }

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
      {feedback.map((feedback) => (
        <CardContent
          key={feedback.feedback_id}
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
              {feedback.memberName.charAt(0)}
            </Avatar>
            <div>
              <p style={{ fontWeight: "600", margin: 0 }}>{feedback.memberName}</p>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#9e9e9e",
                  margin: 0,
                }}
              >
                {formatDate(feedback.feedback_date)}
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
            <span style={{ fontWeight: "600" }}>{feedback.trainerName}</span> -{" "}
            {feedback.class_name}
          </p>
          <Rating
            name="read-only"
            value={(feedback.class_rating + feedback.trainer_rating)/2}
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
            {feedback.comments}
          </p>
        </CardContent>
      ))}
    </Card>
  );
}
