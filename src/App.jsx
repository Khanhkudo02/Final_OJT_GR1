import { Layout, theme } from "antd";
import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ResetPassword from "../src/pages/ResetPassword";
import AccountInfo from "./Components/AccountInfo.jsx";
import AddLanguage from "./Components/AddLanguage";
import AddPosition from "./Components/AddPosition";
import ChangePassword from "./Components/ChangePassword";
import EditLanguage from "./Components/EditLanguage";
import EditPosition from "./Components/EditPosition";
import EmployeeManagement from "./Components/EmployeeManagement";
import LanguageDetails from "./Components/LanguageDetails";
import LanguageManagement from "./Components/LanguageManagement";
import NewProject from "./Components/NewProject";
import PositionDetails from "./Components/PositionDetails";
import PositionManagement from "./Components/PositionManagement";
import ProjectDetail from "./Components/ProjectDetail";
import ProjectEdit from "./Components/ProjectEdit";
import ProjectManagement from "./Components/ProjectManagement";
import Sidebar from "./Components/Sidebar";
import TechnologyManagement from "./Components/TechnologyManagement";
import Admin from "./pages/Admin";
import ForgetPassword from "./pages/ForgetPassword";
import Login from "./pages/LoginPage";
import PageCV from "./pages/PageCV";

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

  const handleLogin = (userInfo) => {
    setUser(userInfo);
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
                {user && <Sidebar role={user.role} />}
                <Layout
                  style={{ marginLeft: user && user.role === "admin" ? 0 : 0 }}
                >
                  <Content
                    style={{ margin: "24px 16px 0", overflow: "initial" }}
                  >
                    <div style={{ padding: 24, background: colorBgContainer }}>
                      <Routes>
                        <Route path="/employee" element={<AccountInfo />} />
                        <Route path="/cv" element={<PageCV />} />
                        <Route path="/account-management" element={<Admin />} />
                        <Route path="/account-info" element={<AccountInfo />} />
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
                        <Route
                          path="/project/:id"
                          element={<ProjectDetail />}
                        />
                        <Route path="/edit-project/:id" element={<ProjectEdit />} />

                        <Route
                          path="/position-management"
                          element={<PositionManagement />}
                        />
                        <Route
                          path="/positions/add"
                          element={<AddPosition />}
                        />
                        <Route
                          path="/position-management/edit/:id"
                          element={<EditPosition />}
                        />
                        <Route
                          path="/position-management/view/:id"
                          element={<PositionDetails />}
                        />
                        <Route
                          path="/technology-management"
                          element={<TechnologyManagement />}
                        />
                        <Route
                          path="/programing-language"
                          element={<LanguageManagement />}
                        />
                        <Route
                          path="/programing-language/add"
                          element={<AddLanguage />}
                        />
                        <Route
                          path="/programing-language/edit/:id"
                          element={<EditLanguage />}
                        />
                        <Route
                          path="/programing-language/view/:id"
                          element={<LanguageDetails />}
                        />
                        <Route path="/new-project" element={<NewProject />} />
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