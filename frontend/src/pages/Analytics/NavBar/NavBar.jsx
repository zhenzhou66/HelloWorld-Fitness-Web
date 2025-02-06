import styles from "./NavBar.module.css"; // Assuming you are using CSS Modules

function NavBar({ setSelectedComponent }) {
  return (
    <nav className={styles.navbar}>
      <button
        onClick={() => setSelectedComponent("PageOne")}
        className={styles.navButton}
      >
        Gym Attendance
      </button>
      <button
        onClick={() => setSelectedComponent("PageTwo")}
        className={styles.navButton}
      >
        Class Attendance
      </button>
      <button
        onClick={() => setSelectedComponent("PageThree")}
        className={styles.navButton}
      >
        Financial
      </button>
    </nav>
  );
}

export default NavBar;
