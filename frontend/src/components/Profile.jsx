import React, { useState, useEffect } from "react";
import classes from "../App.module.css";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user") 
    ? JSON.parse(localStorage.getItem("user")) 
    : null;    if (storedUser) {
      setProfileData(storedUser);
    }
  }, []);

  if (!profileData) {
    return <p>Loading...</p>;
  }

  return (
    <div className={classes.Profile}>
      <ul className={classes.ProfileContent}>
        <li className={classes.content}>
          <div className={classes.pfp}>
            <img src={`http://localhost:5000/uploads/${profileData.profile_picture || "pfp10.jpg"}`} alt="Profile" />
          </div>
          <div className={classes.name}>{profileData.name}</div>
        </li>
      </ul>
    </div>
  );
};

export default Profile;
