// src/pages/ResetPassword.js

import { Alert, Button, Form, Input, Typography } from "antd";
import emailjs from "emailjs-com";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import "../assets/style/Pages/ForgetPassword.scss";
// Import SCSS file

const { Title } = Typography;

function ForgetPassword() {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleForgetPassword = async (values) => {
    const { email } = values;

    try {
      const db = getDatabase();
      const userRef = ref(db, `users`);
      const snapshot = await get(userRef);
      const usersData = snapshot.val();

      // Tìm người dùng với email đã cho
      const user = Object.entries(usersData).find(
        ([id, data]) => data.email === email
      );

      if (user) {
        const [userId] = user;
        const resetLink = `http://localhost:5173/reset-password?userId=${encodeURIComponent(
          userId
        )}`;

        const response = await emailjs.send(
          "service_38z8rf8", // Service ID của bạn
          "template_yh7totx", // Template ID của bạn
          {
            user_email: email, // Tên biến khớp với template
            reset_link: resetLink,
          },
          "BLOiZZ22_oSBTDilA" // User ID của bạn
        );
        console.log("Email sent successfully:", response);
        setSuccessMessage("Password reset instructions sent to your email.");
        form.resetFields(); // Reset form fields after success
      } else {
        setError("User does not exist.");
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      setError("Failed to send password reset instructions.");
    }
  };
  const handleLogout = () => {
    // Clear any authentication tokens or user data
    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <Title level={2} className="title">
          Reset Password
        </Title>
        <Form form={form} onFinish={handleForgetPassword}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input type="email" placeholder="Enter your email address" />
          </Form.Item>
          {error && <Alert message={error} type="error" showIcon />}
          {successMessage && <Alert message={successMessage} type="success" showIcon />}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Send Email
            </Button>
          </Form.Item>
        </Form>
        <Form
          onFinish={handleLogout}
          className="logout-form"
          layout="vertical"
        >
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Log Out
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default ForgetPassword;
