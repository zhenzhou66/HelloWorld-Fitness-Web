import React, {useEffect, useState} from "react";
import classes from "../GymAtd.module.css";

function InfoCards() {
  const [statistics, setStatistics] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics/generalStats")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        setStatistics(data); 
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  return (
    <div className={classes.upperSection}>
      <div className={classes.card}>
        <p>Total Check-ins Today</p>
        <h3>{statistics.totalCheckIn ? statistics.totalCheckIn:0}</h3>
      </div>
      <div className={classes.card}>
        <p>Average Attendance per Day</p>
        <h3>{isNaN(statistics.avgAttendance)? "N/A": Math.floor(Number(statistics.avgAttendance))}</h3>
      </div>
      <div className={classes.card}>
        <p>Attendance Rate</p>
        <h3>{statistics.attendanceRate ? (statistics.attendanceRate.toFixed(2))+"%": `N/A`}</h3>
      </div>
      <div className={classes.card}>
        <p>Peak Attendance Hour</p>
        <h3>{isNaN(statistics.peakHour)? "N/A":statistics.peakHour}</h3>
      </div>
    </div>
  );
}

export default InfoCards;
