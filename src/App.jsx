import { Layout, theme } from "antd";
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ResetPassword from "../src/pages/ResetPassword";
import ChangePassword from "./Components/ChangePassword";
import EmployeeManagement from "./Components/EmployeeManagement";
import NewProject from "./Components/NewProject";
import PositionManagement from "./Components/PositionManagement";
import ProgramingLanguage from "./Components/ProgramingLanguage";
import ProjectManagement from "./Components/ProjectManagement";
import Sidebar from "./Components/Sidebar";
import TechnologyManagement from "./Components/TechnologyManagement";
import Admin from "./pages/Admin";
import Employee from "./pages/Employee";
import ForgetPassword from "./pages/ForgetPassword";
import Login from "./pages/LoginPage";
import PageCV from "./pages/PageCV";
import ProjectDetail from "./Components/ProjectDetail";
import AddPosition from "./Components/AddPosition"; 

const { Content } = Layout;

const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Initialize user state with local storage data
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [role, setRole] = useState(user ? user.role : "");

  // Update user state if local storage changes
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setRole(userData.role);
    }
  }, []);

  const handleLogin = (userInfo) => {
    setUser(userInfo);
    setRole(userInfo.role);
  };

  // eslint-disable-next-line react/prop-types
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login setUser={handleLogin} />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout style={{ minHeight: "100vh" }}>
                {user && role === "admin" && <Sidebar />}
                <Layout
                  style={{ marginLeft: user && role === "admin" ? 0 : 0 }}
                >
                  <Content
                    style={{ margin: "24px 16px 0", overflow: "initial" }}
                  >
                    <div style={{ padding: 24, background: colorBgContainer }}>
                      <Routes>
                        <Route path="/employee" element={<Employee />} />
                        <Route path="/cv" element={<PageCV />} />
                        <Route path="/account-management" element={<Admin />} />
                        <Route
                          path="/change-password"
                          element={<ChangePassword />}
                        />
                        <Route
                          path="/employee-management"
                          element={<EmployeeManagement />}
                        />
                        <Route
                          path="/project-management"
                          element={<ProjectManagement />}
                        />
                          <Route path="/project/:id" 
                          element={<ProjectDetail />} />
                        <Route
                          path="/position-management"
                          element={<PositionManagement />}
                        />
                        <Route
                          path="/positions/add"
                          element={<AddPosition />}
                        />
                        <Route
                          path="/technology-management"
                          element={<TechnologyManagement />}
                        />
                        <Route
                          path="/programing-language"
                          element={<ProgramingLanguage />}
                        />
                        <Route path="/new-project" element={<NewProject />} />{" "}
                        {/* Add the NewProject route */}
                        <Route path="/" element={<Navigate to="/login" />} />
                      </Routes>
                    </div>
                  </Content>
                </Layout>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
