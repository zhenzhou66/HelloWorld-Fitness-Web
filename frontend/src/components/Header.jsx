import { useLocation } from "react-router-dom";
import classes from "../App.module.css";

const Header = () => {
  const location = useLocation();

  //titles and descriptions for different pages
  const pageDetails = {
    "/Dashboard": {
      title: "Dashboard",
      description: "Summary of total revenue, total active members, and more.",
    },
    "/Members": {
      title: "Member Management",
      description:
        "Add, update, search, view, and delete member records to update the member database.",
    },
    "/Trainers": {
      title: "Trainer Management",
      description:
        "Add, update, search, view, and delete trainer records to update the trainer database.",
    },
    "/Memberships": {
      title: "Membership Management",
      description:
        "Create, update, search, view, and delete membership plans to update membership database.",
    },
    "/Schedules": {
      title: "Class Schedules",
      description: "Create, update & manage gym class schedules.",
    },
    "/Analytics": {
      title: "Analytics",
      description:
        "View and generate report of analytics on member attendance, class popularity & more.",
    },
    "/Billing": {
      title: "Billing",
      description: "Manage billing and invoices for members.",
    },
    "/Announcements": {
      title: "Announcements",
      description: "Create and send announcements to members and trainers.",
    },
    "/Feedback": {
      title: "Feedback",
      description: "Track trainer's peformance and view feedback from members.",
    },
  };

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
