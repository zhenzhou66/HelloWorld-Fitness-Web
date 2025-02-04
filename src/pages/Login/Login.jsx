import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Login.module.css";
import logo from "../../assets/logo.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/Dashboard");
  };
  const error = "";
  return (
    <div className={classes["login-container"]}>
      <div className={classes["login-left-panel"]}>
        <div className={classes["login-logo"]}>
          <img src={logo} alt="Logo" className={classes["logo-image"]} />
        </div>
      </div>

      <div className={classes["login-right-panel"]}>
        <h2>Welcome</h2>
        <p className={classes["login-text"]}>
          Please login to admin dashboard.
        </p>
        {error && <p className={classes["error-text"]}>{error}</p>}
        <input
          type="text"
          placeholder="USERNAME"
          className={classes["input"]}
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="PASSWORD"
          className={classes["input"]}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={classes["button"]} onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
