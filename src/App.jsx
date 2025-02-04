import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import classes from "./App.module.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Dashboard from "./pages/Dashboard/Dashboard";
import Members from "./pages/Members/Members";
import Trainers from "./pages/Trainers";
import Memberships from "./pages/Memberships";
import Schedules from "./pages/Schedules";
import Analytics from "./pages/Analytics";
import Billing from "./pages/Billing";
import Announcements from "./pages/Announcements";
import Login from "./pages/Login/Login";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect from root to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Layout */}
        <Route
          path="/*"
          element={
            <div className={classes.App}>
              <Sidebar />
              <div className={classes.AppContent}>
                <div className={classes.HeaderProfile}>
                  <Header />
                  <Profile />
                </div>

                <div className={classes.PageContent}>
                  <Routes>
                    <Route path="/Dashboard" element={<Dashboard />} />
                    <Route path="/Members" element={<Members />} />
                    <Route path="/Trainers" element={<Trainers />} />
                    <Route path="/Memberships" element={<Memberships />} />
                    <Route path="/Schedules" element={<Schedules />} />
                    <Route path="/Analytics" element={<Analytics />} />
                    <Route path="/Billing" element={<Billing />} />
                    <Route path="/Announcements" element={<Announcements />} />
                  </Routes>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
