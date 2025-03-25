import React, {useState, useEffect} from "react";
import classes from "../ClassAtd.module.css";

function SumStats() {
  const [statistics, setStatistics] = useState([]);
  
    useEffect(() => {
      fetch("http://localhost:5000/api/analytics/classStats")
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
    <div className={classes.rightsection}>
      <h3> Summary Statistics</h3>

      <div className={classes.stat}>
        <h4> Total Students</h4>
        <p> {statistics.totalStudent? statistics.totalStudent:0}</p>
      </div>
      <div className={classes.stat}>
        <h4> Present</h4>
        <p> {statistics.presentStudent ? statistics.presentStudent:0}</p>
      </div>
      <div className={classes.stat}>
        <h4> Absent</h4>
        <p> {statistics.absentStudent ? statistics.absentStudent:0 }</p>
      </div>
    </div>
  );
}

export default SumStats;
