import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Admin from "./pages/Admin";
import Users from "./pages/Users";
import ForgetPassword from "./pages/ForgetPassword";
import Sidebar from './Components/Sidebar';



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/admin" element={<Admin />}></Route>
        <Route path="/employee" element={<Users />}></Route>
        <Route path="/forget-password" element={<ForgetPassword />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
