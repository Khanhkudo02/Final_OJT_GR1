import { Button, Form, Input, message } from "antd";
import bcrypt from "bcryptjs";
import { get, getDatabase, ref, update } from "firebase/database";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../assets/style/Pages/ResetPassword.scss";

function ResetPasswordPage() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleResetPassword = async (values) => {
    const { email, newPassword, confirmPassword } = values;

    if (!email || !newPassword || !confirmPassword) {
      message.error(t("Please Fill All Fields"));
      return;
    }

    if (newPassword.length < 6) {
      message.error(t("Password Min Length"));
      return;
    }

    if (newPassword !== confirmPassword) {
      message.error(t("Passwords Do Not Match"));
      return;
    }

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
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await update(ref(db, `users/${userId}`), { password: hashedPassword });
        message.success(t("Password Reset Successful"));
        navigate("/login"); // Điều hướng đến trang đăng nhập sau khi reset mật khẩu thành công
      } else {
        message.error(t("User Does Not Exist"));
      }
    } catch (error) {
      message.error(t("Error Resetting Password"));
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h1>{t("Reset Password")}</h1>
        <Form form={form} onFinish={handleResetPassword} layout="vertical">
          <Form.Item
            label={t("email")}
            name="email"
            rules={[{ required: true, message: t("pleaseInputEmail") }]}
          >
            <Input placeholder={t("Enter Your Email")} />
          </Form.Item>
          <Form.Item
            label={t("New Password")}
            name="newPassword"
            rules={[
              { required: true, message: t("Please Input New Password") },
              { min: 6, message: t("passwordMinLength") },
            ]}
          >
            <Input.Password placeholder={t("Enter New Password")} />
          </Form.Item>
          <Form.Item
            label={t("Confirm Password")}
            name="confirmPassword"
            rules={[
              { required: true, message: t("Please Confirm New Password") },
              { min: 6, message: t("passwordMinLength") },
            ]}
          >
            <Input.Password placeholder={t("Confirm New Password")} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {t("Reset Password")}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
