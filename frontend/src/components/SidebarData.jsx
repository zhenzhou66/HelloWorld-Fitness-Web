import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export const SidebarData = [
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    link: "/Dashboard",
  },
  {
    title: "Members",
    icon: <PeopleIcon />,
    link: "/Members",
  },
  {
    title: "Trainers",
    icon: <SupervisedUserCircleIcon />,
    link: "/Trainers",
  },
  {
    title: "Memberships",
    icon: <ContactMailIcon />,
    link: "/Memberships",
  },
  {
    title: "Schedules",
    icon: <ScheduleIcon />,
    link: "/Schedules",
  },
  {
    title: "Analytics",
    icon: <AssessmentIcon />,
    link: "/Analytics",
  },
  {
    title: " Billing",
    icon: <AccountBalanceIcon />,
    link: "/Billing",
  },
  {
    title: " Announcements",
    icon: <AnnouncementIcon />,
    link: "/Announcements",
  },
  {
    title: "Logout",
    icon: <ExitToAppIcon />,
    link: "/Login",
  },
];
