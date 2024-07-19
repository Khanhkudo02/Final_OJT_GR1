import React, { useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Admin from "./pages/Admin";
import Users from "./pages/Users";
import { logIn, signUp } from "./service/authService";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    try {
      const user = await signUp(email, password, role);
      setUser(user);
      setUserRole(role);
      console.log("User signed up:", user);
    } catch (error) {
      setError("Error signing up: " + error.message);
      console.error("Error signing up:", error);
    }
  };

  const handleLogIn = async () => {
    try {
      const { user, userData } = await logIn(email, password);
      setUser(user);
      setUserData(userData);
      setUserRole(userData.role);
      console.log("User logged in:", user);
      console.log("User data:", userData);
    } catch (error) {
      setError("Error logging in: " + error.message);
      console.error("Error logging in:", error);
    }
  };

  useEffect(() => {
    console.log("User data:", userData);
  }, [userData]);

  return (
    <Router>
      <div>
        <h1>Firebase Role-Based Authentication</h1>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
          </select>
          <button onClick={handleSignUp}>Sign Up</button>
          <button onClick={handleLogIn}>Log In</button>
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {user ? (
          <div>
            <h2>Welcome, {user.email}</h2>
            <p>Your role is: {userRole}</p>
            <Routes>
              {userRole === "admin" ? (
                <Route path="/admin" element={<Admin />} />
              ) : (
                <Route path="/users" element={<Users />} />
              )}
              {/* Redirect to the correct route based on the user role */}
              <Route path="/" element={<Navigate to={userRole === "admin" ? "/admin" : "/users"} />} />
            </Routes>
          </div>
        ) : (
          <Routes>
            {/* Add a default route to handle the root path */}
            <Route path="/" element={<div>Please log in or sign up</div>} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
