import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout, theme } from "antd";
import Sidebar from "./Components/Sidebar";
import Login from "./pages/LoginPage";
import Admin from "./pages/Admin";
import ForgetPassword from "./pages/ForgetPassword";
import AccountManagement from "./Components/AccountManagement";
import EmployeeManagement from "./Components/EmployeeManagement";
import ProjectManagement from "./Components/ProjectManagement";
import PositionManagement from "./Components/PositionManagement";
import TechnologyManagement from "./Components/TechnologyManagement";
import ProgramingLanguage from "./Components/ProgramingLanguage";
import PageCV from "./pages/PageCV";
import Employee from "./pages/Employee";

const { Header, Content, Footer } = Layout;

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
      const userInfo = await getUserInfo(); // getUserInfo() trả về thông tin người dùng
      if (userInfo) {
        setUser(userInfo);
        setRole(userInfo.role); // Giả sử userInfo.role là vai trò của người dùng
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route
          path="/*"
          element={
            <Layout style={{ minHeight: "100vh" }}>
              {user && role === "admin" && <Sidebar />}
              <Layout
                style={{ marginLeft: user && role === "admin" ? 200 : 0 }}
              >
                <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
                  <div style={{ padding: 24, background: "#fff" }}>
                    <Routes>
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/employee" element={<Employee />} />
                      <Route path="/cv" element={<PageCV />} />
                      <Route
                        path="/account-management"
                        element={<AccountManagement />}
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
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
