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
import "../assets/style/Pages/Sidebar.scss";
import LogoutButton from "./LogoutButton";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const { Sider } = Layout;

const Sidebar = ({ role }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();

  const adminMenuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: <NavLink to="/account-management">{t("ManageAccounts")}</NavLink>,
      children: [
        {
          key: "1-1",
          label: <NavLink to="/account-info">{t("AccountInfo")}</NavLink>,
        },
        {
          key: "1-2",
          label: <NavLink to="/change-password">{t("changePassword")}</NavLink>,
        },
      ],
    },
    {
      key: "2",
      icon: <TeamOutlined />,
      label: <NavLink to="/employee-management">{t("employee")}</NavLink>,
    },
    {
      key: "3",
      icon: <ProjectOutlined />,
      label: <NavLink to="/project-management">{t("ProjectManagement")}</NavLink>,
      children: [
        {
          key: "3-1",
          label: <NavLink to="/new-project">{t("NewProject")}</NavLink>,
        },
        {
          key: "3-2",
          label: <NavLink to="/project-tracking">{t("ProjectTracking")}</NavLink>,
        },
      ],
    },
    {
      key: "4",
      icon: <TeamOutlined />,
      label: <NavLink to="/position-management">{t("PositionManagement")}</NavLink>,
    },
    {
      key: "5",
      icon: <ToolOutlined />,
      label: (
        <NavLink to="/technology-management">{t("TechnologyManagement")}</NavLink>
      ),
    },
    {
      key: "6",
      icon: <CodeOutlined />,
      label: <NavLink to="/programing-language">{t("ProgrammingLanguageManagement")}</NavLink>,
    },
    {
      key: "7",
      label: <LanguageSwitcher collapsed={collapsed} />,
    },
    {
      key: "8",
      label: <LogoutButton collapsed={collapsed} />,
    },
  ];

  const employeeMenuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: <NavLink to="/employee">{t("EmployeeAccount")}</NavLink>,
      children: [
        {
          key: "1-1",
          label: <NavLink to="/account-info">{t("AccountInfo")}</NavLink>,
        },
        {
          key: "1-2",
          label: <NavLink to="/change-password">{t("changePassword")}</NavLink>,
        },
      ],
    },
    {
      key: "3",
      icon: <ProjectOutlined />,
      label: <NavLink to="/employee-ProjectManagement">{t("ListProject")}</NavLink>,
    },
    {
      key: "4",
      label: <LogoutButton collapsed={collapsed} />,
    },
  ];

  return (
    <Sider
      className="sidebar"
      collapsible
      collapsed={collapsed}
      onCollapse={(collapsed) => setCollapsed(collapsed)}
      width={229}
    >
      <div className="sidebar-header">
        <img
          src="/public/images/logo.jpg"
          alt="Get IT"
          className="logo-sidebar"
        />
        {!collapsed && <h2 className="sidebar-title">GETIT COMPANY</h2>}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={role === "admin" ? adminMenuItems : employeeMenuItems}
      />
    </Sider>
  );
};

export default Sidebar;
