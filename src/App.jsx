// App.jsx
import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Admin from "./pages/Admin";
import Employee from "./pages/Employee";
import Login from "./pages/LoginPage";
import { Layout } from "antd";
import Sidebar from "./Components/Sidebar";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout style={{ marginLeft: 200 }}>
          <Header style={{ padding: 0, background: colorBgContainer }} />
          <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
            <div
              style={{
                padding: 24,
                background: colorBgContainer,
              }}
            >
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/cv" element={<PageCV />} />
                <Route path="/employee" element={<Employee />} />
                <Route path="/forget-password" element={<ForgetPassword />} />
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
          {/* <Footer style={{ textAlign: "center" }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer> */}
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
