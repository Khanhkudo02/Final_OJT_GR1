import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  UserOutlined,
  ProjectOutlined,
  TeamOutlined,
  ToolOutlined,
  CodeOutlined,
  FileTextOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: <NavLink to="/account-management">Manage Accounts</NavLink>,
      children: [
        {
          key: "1-1",
          label: <NavLink to="/account-info">Account Info</NavLink>,
        },
      ],
    },
    {
      key: "2",
      icon: <ProjectOutlined />,
      label: <NavLink to="/project-management">Project Management</NavLink>,
      children: [
        {
          key: "2-1",
          label: <NavLink to="/project-info">Project Info</NavLink>,
        },
        {
          key: "2-2",
          label: <NavLink to="/assign-employees">Assign Employees</NavLink>,
        },
        {
          key: "2-3",
          label: <NavLink to="/project-tracking">Project Tracking</NavLink>,
        },
      ],
    },
    {
      key: "3",
      icon: <TeamOutlined />,
      label: <NavLink to="/position-management">Position Management</NavLink>,
    },
    {
      key: "4",
      icon: <ToolOutlined />,
      label: (
        <NavLink to="/technology-management">Technology Management</NavLink>
      ),
    },
    {
      key: "5",
      icon: (
        <img
          src="public\images\sidebar-employees.png"
          alt="Employee Management"
          style={{ width: "20px", height: "20px" }}
        />
      ),
      label: <NavLink to="/employee-management">Employee Management</NavLink>,
    },
    {
      key: "6",
      icon: <CodeOutlined />,
      label: <NavLink to="/programing-language">Languages</NavLink>,
    },
    {
      key: "7",
      icon: <FileTextOutlined />,
      label: <NavLink to="/cv">CV</NavLink>,
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(collapsed) => setCollapsed(collapsed)}
      width={200}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div className="sidebar-header">
        <img src="#" alt="Get IT" className="logo" />
        <Button type="text" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;
