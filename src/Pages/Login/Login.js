import React, { useState, useContext } from "react";
import { CREATE_NEW_USER, SIGN_IN } from "../../api/api";
import UserContext from "../../Contexts/UserContext";
import "./Login.css";

function Login() {
  const user = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      SIGN_IN(user.setUser, email, password);
    }
  });

  return (
    <div className="login-wrapper">
      <div>WOOFER</div>

      <div className="login-input-wrapper">
        <div>Please Sign In</div>
        <input
          type="text"
          autoComplete="email"
          placeholder="EMAIL"
          className="login-input"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="text"
          autoComplete="password"
          placeholder="PASSWORD"
          className="login-input"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          className="login-button"
          onClick={() => {
            SIGN_IN(user.setUser, email, password);
          }}
        >
          LOG IN
        </button>
      </div>
      <div>or</div>
      <button
        className="signup-button"
        onClick={() => {
          CREATE_NEW_USER(user, email, password);
        }}
      >
        SIGN UP
      </button>
    </div>
  );
}

export default Login;
