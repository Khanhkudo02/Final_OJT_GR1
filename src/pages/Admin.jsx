import { Menu } from "antd";
import React from "react";
import TechnologyManagement from "../Components/TechnologyManagement";
import "antd/dist/reset.css";
import Sidebar from "../Components/Sidebar";

function Admin() {
  return (
    <div style={{ padding: 20 }}>
      <TechnologyManagement />

      <Sidebar />
    </div>
  );
}

export default Admin;
