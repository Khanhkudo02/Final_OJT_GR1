import { Menu } from "antd";
import React from "react";
import TechnologyManagement from '/Users/mac/Documents/Final_OJT_GR1/src/Components/TechnologyManagement.jsx';
import 'antd/dist/reset.css';
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
