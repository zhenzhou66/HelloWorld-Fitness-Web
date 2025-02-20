import React from "react";
import { useNavigate } from "react-router-dom";
import classes from "../App.module.css";
import { SidebarData } from "./SidebarData";
import logo from "../assets/logo-black.png";

function Sidebar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("user"); 
    navigate("/login"); 
  };

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
                if (val.action === "logout") {
                  handleLogout(); 
                } else {
                  navigate(val.link);
                }
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
