import { Card, Descriptions, message } from "antd";
import { get, getDatabase, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function AccountInfo() {
  const { t } = useTranslation();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          navigate("/login"); // Chuyển hướng đến trang đăng nhập nếu không có người dùng
          return;
        }
        
        const db = getDatabase();
        const userRef = ref(db, `users/${userId}`);
        const snapshot = await get(userRef);
        const data = snapshot.val();
        setUserData(data);
      } catch (error) {
        message.error(t("errorFetchingUserData"));
      }
    };

    fetchUserData();
  }, [navigate, t]);

  if (!userData) {
    return <p>{t("loading")}</p>;
  }

  return (
    <Card title={t("userProfile")}>
    <Descriptions bordered column={1}>
      <Descriptions.Item label={t("email")}>{userData.email}</Descriptions.Item>
      <Descriptions.Item label={t("name")}>{userData.name}</Descriptions.Item>
      <Descriptions.Item label={t("role")}>{userData.role}</Descriptions.Item>
      <Descriptions.Item label={t("status")}>{userData.status}</Descriptions.Item>
      <Descriptions.Item label={t("createdAt")}>{new Date(userData.createdAt).toLocaleDateString()}</Descriptions.Item>
      {/* Hiển thị các thông tin khác của người dùng tại đây */}
    </Descriptions>
  </Card>
  );
}

export default AccountInfo;
