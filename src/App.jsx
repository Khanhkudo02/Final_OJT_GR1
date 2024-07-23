import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Layout, theme } from "antd";
import AccountManagement from "./Components/AccountManagement";
import EmployeeManagement from "./Components/EmployeeManagement";
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

const { Content } = Layout;

const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");

  // Giả sử bạn có một hàm để lấy thông tin người dùng từ API hoặc Firebase
  useEffect(() => {
    // Giả sử fetchUserInfo() là hàm lấy thông tin người dùng
    const fetchUserInfo = async () => {
      const userInfo = await setUser(); // getUserInfo() trả về thông tin người dùng
      if (userInfo) {
        setUser(userInfo);
        setRole(userInfo.role); // Giả sử userInfo.role là vai trò của người dùng
      }
    };
    fetchUserInfo();
  }, []);

  const handleLogin = (userInfo) => {
    setUser(userInfo);
    setRole(userInfo.role);
  };

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
                          path="/employee-management"
                          element={<EmployeeManagement />}
                        />
                        <Route
                          path="/project-management"
                          element={<ProjectManagement />}
                        />
                        <Route
                          path="/position-management"
                          element={<PositionManagement />}
                        />
                        <Route
                          path="/technology-management"
                          element={<TechnologyManagement />}
                        />
                        <Route
                          path="/programing-language"
                          element={<ProgramingLanguage />}
                        />
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