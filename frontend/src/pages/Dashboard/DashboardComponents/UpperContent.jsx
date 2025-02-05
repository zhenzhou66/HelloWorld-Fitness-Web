import React from "react";
import classes from "../Dashboard.module.css";
import { useState, useEffect } from "react";

const UpperContent = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, activeMembers: 0, totalTrainers: 0 });

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/stats")
      .then((response) => response.json())
      .then((data) => setStats(data))
      .catch((error) => console.error("Error fetching stats:", error));
  }, []);

  return (
    <div className={classes.UpperContent}>
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
