import React from "react";
import { useNavigate } from "react-router-dom";
import classes from "../App.module.css";
import { SidebarData } from "./SidebarData";
import logo from "../assets/logo.png";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className={classes.Sidebar}>
      <ul className={classes.SidebarList}>
        <img src={logo} alt="logo" className={classes.logo} />
        {SidebarData.map((val, key) => {
          return (
            <li
              key={key}
              className={classes.row}
              onClick={() => {
                navigate(val.link);
              }}
            >
              <div className={classes.icon}>{val.icon} </div>
              <div className={classes.title}>{val.title}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;
