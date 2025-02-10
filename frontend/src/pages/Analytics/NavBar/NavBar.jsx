import { useState } from "react";
import styles from "./NavBar.module.css";

function NavBar({ setSelectedComponent }) {
  const [activeButton, setActiveButton] = useState("PageOne");

  const handleClick = (component) => {
    setSelectedComponent(component);
    setActiveButton(component);
  };

  return (
    <nav className={styles.navbar}>
      <button
        onClick={() => handleClick("PageOne")}
        className={`${styles.navButton} ${
          activeButton === "PageOne" ? styles.active : ""
        }`}
      >
        Gym Attendance
      </button>
      <button
        onClick={() => handleClick("PageTwo")}
        className={`${styles.navButton} ${
          activeButton === "PageTwo" ? styles.active : ""
        }`}
      >
        Class Attendance
      </button>
      <button
        onClick={() => handleClick("PageThree")}
        className={`${styles.navButton} ${
          activeButton === "PageThree" ? styles.active : ""
        }`}
      >
        Financial
      </button>
    </nav>
  );
}

export default NavBar;
