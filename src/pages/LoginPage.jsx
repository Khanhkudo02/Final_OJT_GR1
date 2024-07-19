// src/components/Login.js
import { database } from "../firebaseConfig";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { loginUser, signUpUser } from '../service/authService.js';

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (isSignUp) {
      const { success, error } = await signUpUser(e, email, password, setSuccessMessage, setError);
      
      if (!success) {
        setError(error);
      }
    } else {
      const { user, error } = await loginUser(e, email, password, setUser, setError, navigate);
      
      if (!user) {
        setError(error);
      }
    }
  };

  return (
    <div>
      <h1>{isSignUp ? "Sign Up" : "Login"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && (
          <div>
            <p style={{ color: "green" }}>{successMessage}</p>
            <button type="button" onClick={() => setIsSignUp(false)}>
              Back to Login
            </button>
          </div>
        )}
        <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
        <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Already have an account? Login" : "Need an account? Sign Up"}
        </button>
      </form>
    </div>
  );
}

Login.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default Login;
