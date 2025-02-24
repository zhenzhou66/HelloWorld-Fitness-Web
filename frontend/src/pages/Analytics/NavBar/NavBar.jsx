import { useState } from "react";
import styles from "./NavBar.module.css";

function NavBar({ setSelectedComponent, buttons }) {
  const [activeButton, setActiveButton] = useState(buttons[0].component); // Default active button

  const handleClick = (component) => {
    setSelectedComponent(component);
    setActiveButton(component);
  };

  return (
    <nav className={styles.navbar}>
      {buttons.map(({ label, component }) => (

        <button
          key={component} onClick={() => handleClick(component)} className={`${styles.navButton} ${
            activeButton === component ? styles.active : ""
          }`}
        >
          {label}
        </button>

      ))}
    </nav>
  );
}

export default NavBar;
