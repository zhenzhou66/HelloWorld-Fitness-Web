import React from "react";
import classes from "../App.module.css";
import { ProfileData } from "./ProfileData";

const Profile = () => {
  return (
    <div className={classes.Profile}>
      <ul className={classes.ProfileContent}>
        {ProfileData.map((val, key) => {
          return (
            <li key={key} className={classes.content}>
              <div className={classes.pfp}>{val.pfp} </div>
              <div className={classes.name}>{val.Name}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Profile;
