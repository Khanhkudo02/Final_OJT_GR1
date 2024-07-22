import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  ProjectOutlined,
  TeamOutlined,
  ToolOutlined,
  CodeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
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
        {
          key: "1-2",
          label: <NavLink to="/reset-password">Reset Password</NavLink>,
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
      label: <NavLink to="/technology-management">Technology</NavLink>,
    },
    {
      key: "5",
      icon: <TeamOutlined />,
      label: <NavLink to="/employee-management">Employee</NavLink>,
      children: [
        {
          key: "5-1",
          label: <NavLink to="/employee-profile">Employee Profile</NavLink>,
        },
        {
          key: "5-2",
          label: <NavLink to="/assign-project">Assign Project</NavLink>,
        },
      ],
    },
    {
      key: "6",
      icon: <CodeOutlined />,
      label: <NavLink to="/programing-language">Languages</NavLink>,
      children: [
        {
          key: "6-1",
          label: (
            <NavLink to="/programming-language-info">
              Programming Language Info
            </NavLink>
          ),
        },
      ],
    },
    {
      key: "7",
      icon: <FileTextOutlined />,
      label: <NavLink to="/cv">CV</NavLink>,
    },
  ];

  return (
    <Sider
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
      <div className="logo" />
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
