import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout, theme } from 'antd';
import Sidebar from './Components/Sidebar';
import LoginPage from './pages/LoginPage';
import Admin from './pages/Admin';
import Users from './pages/Users';
import ForgetPassword from './pages/ForgetPassword';
import AccountManagement from './Components/AccountManagement';
import EmployeeManagement from './Components/EmployeeManagement';
import ProjectManagement from './Components/ProjectManagement';
import PositionManagement from './Components/PositionManagement';
import TechnologyManagement from './Components/TechnologyManagement';
import ProgramingLanguage from './Components/ProgramingLanguage';

const { Header, Content, Footer } = Layout;

const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout style={{ marginLeft: 200 }}>
          <Header style={{ padding: 0, background: colorBgContainer }} />
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div
              style={{
                padding: 24,
                background: colorBgContainer,
              }}
            >
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/employee" element={<Users />} />
                <Route path="/forget-password" element={<ForgetPassword />} />
                <Route path="/account-management" element={<AccountManagement />} />
                <Route path="/employee-management" element={<EmployeeManagement />} />
                <Route path="/project-management" element={<ProjectManagement />} />
                <Route path="/position-management" element={<PositionManagement />} />
                <Route path="/technology-management" element={<TechnologyManagement />} />
                <Route path="/programing-language" element={<ProgramingLanguage />} />
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©{new Date().getFullYear()} Created by Ant UED</Footer>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
