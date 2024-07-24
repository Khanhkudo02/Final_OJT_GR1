import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import "../assets/style/Pages/LogoutButton.scss";

// eslint-disable-next-line react/prop-types
function LogoutButton({ collapsed }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    
    <Button
      className={`logout-button ${collapsed ? 'collapsed' : ''}`}
      type="text"
      icon={<LogoutOutlined />}
      onClick={handleLogout}
    >
      {!collapsed && 'Log Out'} 
    </Button>
 
  );
}

export default LogoutButton;

