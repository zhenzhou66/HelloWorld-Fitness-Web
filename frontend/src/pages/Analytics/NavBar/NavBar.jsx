import { useState } from "react";
import styles from "./NavBar.module.css";

function NavBar({ setSelectedComponent, buttons }) {
  const [activeButton, setActiveButton] = useState(buttons[0].component);

  const handleClick = (component) => {
    setSelectedComponent(component);
    setActiveButton(component);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navButtons}>
        {buttons.map(({ label, component }) => (
          <button
            key={component}
            onClick={() => handleClick(component)}
            className={`${styles.navButton} ${
              activeButton === component ? styles.active : ""
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default NavBar;
