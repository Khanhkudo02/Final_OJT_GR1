import { Card, Descriptions, message } from "antd";
import { get, getDatabase, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../assets/style/Pages/AccountInfo.scss"; // Đảm bảo rằng đường dẫn này đúng

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
    <div className="account-info-container">
      <Card title={t("userProfile")} className="account-info-card">
        <Descriptions bordered column={1}>
          {userData.email && (
            <Descriptions.Item label={t("email")}>
              {userData.email}
            </Descriptions.Item>
          )}
          {userData.name && (
            <Descriptions.Item label={t("name")}>
              {userData.name}
            </Descriptions.Item>
          )}
          {userData.role && (
            <Descriptions.Item label={t("role")}>
              {userData.role}
            </Descriptions.Item>
          )}
          {userData.status && (
            <Descriptions.Item label={t("status")}>
              {userData.status}
            </Descriptions.Item>
          )}
          {userData.createdAt && (
            <Descriptions.Item label={t("createdAt")}>
              {new Date(userData.createdAt).toLocaleDateString()}
            </Descriptions.Item>
          )}
          {userData.dateOfBirth && (
            <Descriptions.Item label={t("dateOfBirth")}>
              {new Date(userData.dateOfBirth).toLocaleDateString()}
            </Descriptions.Item>
          )}
          {userData.address && (
            <Descriptions.Item label={t("address")}>
              {userData.address}
            </Descriptions.Item>
          )}
          {userData.phoneNumber && (
            <Descriptions.Item label={t("phoneNumber")}>
              {userData.phoneNumber}
            </Descriptions.Item>
          )}
          {userData.skills && userData.skills.length > 0 && (
            <Descriptions.Item label={t("skills")}>
              {userData.skills.join(", ")}
            </Descriptions.Item>
          )}
          {userData.department && (
            <Descriptions.Item label={t("department")}>
              {userData.department}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </div>
  );
}

export default AccountInfo;
