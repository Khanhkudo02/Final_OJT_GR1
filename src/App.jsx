// App.jsx
import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Admin from "./pages/Admin";
import Employee from "./pages/Employee";
import Login from "./pages/LoginPage";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/" element={<Login setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;
