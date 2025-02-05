import { useLocation } from "react-router-dom";
import classes from "../App.module.css";

const Header = () => {
  const location = useLocation();

  // Define titles and descriptions for different pages
  const pageDetails = {
    "/Dashboard": {
      title: "Dashboard",
      description: "Summary of total revenue, total active members, and more.",
    },
    "/Members": {
      title: "Member Management",
      description:
        "Add, Update, Search, View, and Delete member records to update the member database.",
    },
    "/Trainers": {
      title: "Trainer Management",
      description:
        "Add, Update, Search, View, and Delete trainer records to update the trainer database.",
    },
    "/Memberships": {
      title: "Membership Management",
      description:
        "Create, update, search, view, and delete workout plan to keep your Membership plan database accurate and organized.",
    },
    "/Schedules": {
      title: "Class Schedules",
      description: "Create, Update & Manage gym class schedules.",
    },
    "/Analytics": {
      title: "Analytics",
      description:
        "View & Generate report of analytics on member attendance, class popularity & more.",
    },
    "/Billing": {
      title: "Billing",
      description: "Manage billing and invoices for members.",
    },
    "/Announcements": {
      title: "Announcements",
      description: "Create and send announcements to members and trainers.",
    },

    // Add more routes as needed
  };

  // Get the current page details or set a default
  const { title, description } = pageDetails[location.pathname] || {
    title: "Page Not Found",
    description: "The page you are looking for does not exist.",
  };

  return (
    <div className={classes.Header}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default Header;
