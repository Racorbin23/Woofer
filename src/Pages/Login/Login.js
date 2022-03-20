import React, { useState, useContext } from "react";
import { CREATE_NEW_USER, SIGN_IN } from "../../api/api";
import UserContext from "../../Contexts/UserContext";
import "./Login.css";

function Login() {
  const user = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setError] = useState("");

  return (
    <div className="login-wrapper">
      <div className="login-title">WOOFER</div>
      <div className="login-error-message">{errorMessage}</div>
      <div className="login-input-wrapper">
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
            SIGN_IN(user.setUser, email, password, setError);
          }}
        >
          LOG IN
        </button>
      </div>
      <div className="login-or">or</div>
      <button
        className="signup-button"
        onClick={() => {
          CREATE_NEW_USER(user, email, password, setError);
        }}
      >
        SIGN UP
      </button>
    </div>
  );
}

export default Login;
