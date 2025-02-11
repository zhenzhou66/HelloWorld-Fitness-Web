import React from "react";
import styles from "./Schedules.module.css";
import { Trash, Edit } from "lucide-react";

const Schedules = () => {
  // Static data for demonstration
  const classes = {
    class_id: "1",
    class_name: "Yoga Flow",
    description: "A relaxing yoga session focused on flexibility and...",
    class_image: "https://via.placeholder.com/50",
    schedule_date: "2025-01-20",
    start_time: "08:00 AM",
    end_time: "09:00 AM",
  };

  const user = {
    profile_picture: "https://via.placeholder.com/50",
    name: "Ali",
  };

  return (
    <div className={styles.schedulesContent}>
      <div className={styles.schedulesFunction}>
        <h3 className={styles.schedulesTitle}>All Classes</h3>
        <div className={styles.schedulesAction}>
          <div className={styles.searchContainer}>
            <input type="text" className={styles.searchInput} placeholder="Search" />
          </div>
          <button className={styles.addClass}>Add Class</button>
        </div>
      </div>

      <table className={styles.schedulesTable}>
        <thead>
          <tr>
            <th className={styles.checkboxclassid}>
              <div className={styles.checkboxContainer}>
                <input type="checkbox" />
                <span>Class ID</span>
              </div>
            </th>
            <th>Class Name</th>
            <th>Schedule Date</th>
            <th>Time</th>
            <th>Assigned Trainer</th>
            <th>Current Participants</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className={styles.checkboxclassid}>
              <div className={styles.checkboxContainer}>
                <input type="checkbox" />
                <span>{classes.class_id}</span>
              </div>
            </td>
            <td>
              <div className={styles.classdetailsContainer}>
                <img src={classes.class_image} alt="Class Image" className={styles.classImage} />
                <div className={styles.classDetails}>
                  <span className={styles.className}>{classes.class_name}</span>
                  <span className={styles.classDescription}>{classes.description}</span>
                </div>
              </div>
            </td>
            <td className={styles.scheduleDate}>{classes.schedule_date}</td>
            <td>
              <span className={styles.classStartTime}>{classes.start_time}</span>
              <span className={styles.dash}>-</span>
              <span className={styles.classEndTime}>{classes.end_time}</span>
            </td>
            <td>
              <div className={styles.assignedTrainerContainer}>
                <img src={user.profile_picture} alt="Trainer Profile Picture" className={styles.trainerImage} />
                <span className={styles.trainerName}>{user.name}</span>
              </div>
            </td>
            <td>
              <span className={styles.classParticipants}>10 / 20</span>
            </td>
            <td>
              <button className={styles.editButton}>
                <Edit size={20} />
              </button>
              <button className={styles.deleteButton}>
                <Trash size={20} />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Schedules;