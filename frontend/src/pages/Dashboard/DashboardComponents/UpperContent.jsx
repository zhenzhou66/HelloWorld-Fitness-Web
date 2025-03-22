import React from "react";
import classes from "../Dashboard.module.css";
import { useState, useEffect } from "react";
import { useRef } from "react";

const UpperContent = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, activeMembers: 0, totalTrainers: 0 });
  const firstRender = useRef(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/stats")
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch((error) => console.error("Error fetching stats:", error));
  }, []);

  const [attendanceCode, setAttendanceCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendanceCode = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/dashboard/getAttendanceCode");
        
        if (!response.ok) {
          if (response.status === 404) {
              generateNewCode(); 
          } else {
              throw new Error("Failed to fetch attendance code");
          }
          return;
        }
        const data = await response.json();
        setAttendanceCode(data.code);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  const generateNewCode = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/dashboard/generateAttendanceCode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Error generating new attendance code");
        }

        const data = await response.json();
        setAttendanceCode(data.code);
    } catch (err) {
        setError(err.message);
    }
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return; 
    }
    fetchAttendanceCode();
  }, []);

  return (
    <div className={classes.UpperContent}>
      <div className={classes.Card}>
        <p>Today's Gym Code</p>
        <h3>{attendanceCode}</h3>
      </div>
      <div className={classes.Card}>
        <p>Total Revenue</p>
        <h3>${stats.totalRevenue}</h3>
      </div>
      <div className={classes.Card}>
        <p>Current Active Members</p>
        <h3>{stats.activeMembers}</h3>
      </div>
      <div className={classes.Card}>
        <p>Total Trainers</p>
        <h3>{stats.totalTrainers}</h3>
      </div>
    </div>
  );
};

export default UpperContent;
