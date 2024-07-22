import React, { useState } from 'react'
import { useNavigate  } from 'react-router-dom';
import { loginUser, signUpUser } from '../service/authService.js';
import PropTypes from "prop-types";
import { database } from "../firebaseConfig";

function LoginPage({ setUser }) {
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
            <h1>Sign in </h1>
            <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Enter your email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
            /><br/>
            <input
                type="password"
                placeholder="Enter your password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <br/>
            <button  type="submit">Sign In</button>
            </form>
        </div>
    )
}

LoginPage.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default LoginPage
