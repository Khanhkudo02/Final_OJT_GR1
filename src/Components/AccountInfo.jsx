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
  const [projects, setProjects] = useState([]);

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

         // Lấy thông tin dự án liên quan đến nhân viên
        const projectsRef = ref(db, `projects`);
        const projectsSnapshot = await get(projectsRef);
        const allProjects = projectsSnapshot.val();
        
        // Lọc các dự án mà nhân viên đang tham gia
        const userProjects = Object.values(allProjects).filter(project =>
          project.teamMembers.includes(userId)
        );
        
        setProjects(userProjects || []);
      } catch (error) {
        message.error(t("errorFetchingUserData"));
      }
    };

    fetchUserData();
  }, [navigate, t]);

  if (!userData) {
    return <p>{t("loading")}</p>;
  }

  // Hàm để viết hoa chữ cái đầu tiên của mỗi từ
  const capitalizeWords = (text) => {
    if (typeof text !== 'string') return text; // Kiểm tra loại dữ liệu
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Hàm định dạng ngày theo dạng "dd/mm/yyyy"
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="account-info-container">
      <Card title={t("userProfile")} className="account-info-card">
        <Descriptions bordered column={1}>
          {userData.email && (
            <Descriptions.Item label={t("email")}>
              {capitalizeWords(userData.email)}
            </Descriptions.Item>
          )}
          {userData.name && (
            <Descriptions.Item label={t("name")}>
              {capitalizeWords(userData.name)}
            </Descriptions.Item>
          )}
          {userData.role && (
            <Descriptions.Item label={t("role")}>
              {capitalizeWords(t(userData.role))}
            </Descriptions.Item>
          )}
          {userData.status && (
            <Descriptions.Item label={t("status")}>
              {capitalizeWords(t(userData.status))}
            </Descriptions.Item>
          )}
          {userData.createdAt && (
            <Descriptions.Item label={t("createdAt")}>
              {/* {new Date(userData.createdAt).toLocaleDateString()} */}
              {formatDate(userData.createdAt)}
            </Descriptions.Item>
          )}
          {userData.dateOfBirth && (
            <Descriptions.Item label={t("dateOfBirth")}>
              {/* {new Date(userData.dateOfBirth).toLocaleDateString()} */}
              {formatDate(userData.dateOfBirth)}
            </Descriptions.Item>
          )}
          {userData.address && (
            <Descriptions.Item label={t("address")}>
              {capitalizeWords(userData.address)}
            </Descriptions.Item>
          )}
          {userData.phoneNumber && (
            <Descriptions.Item label={t("phoneNumber")}>
              {capitalizeWords(userData.phoneNumber)}
            </Descriptions.Item>
          )}
          {userData.skills && userData.skills.length > 0 && (
            <Descriptions.Item label={t("skills")}>
              {userData.skills.map(skill => capitalizeWords(t(`skill${skill.charAt(0).toUpperCase() + skill.slice(1)}`, {
                defaultValue: skill.replace(/_/g, " "),
              }))).join(", ")}
            </Descriptions.Item>
          )}
          {userData.department && (
            <Descriptions.Item label={t("department")}>
              {capitalizeWords(t(userData.department))}
            </Descriptions.Item>
          )}
          {/* Hiển thị thông tin dự án */}
          {projects.length > 0 && (
            <Descriptions.Item label={t("projects")}>
              {projects.map(project => (
                <div key={project.id}>
                  <p><strong>{t("ProjectName")}:</strong> {project.name}</p>
                  <p><strong>{t("Description")}:</strong> {project.description}</p>
                  <p><strong>{t("ClientName")}:</strong> {project.clientName}</p>
                  <p><strong>{t("Budget")}:</strong> {project.budget}</p>
                  <p><strong>{t("StartDate")}:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
                  <p><strong>{t("EndDate")}:</strong> {new Date(project.endDate).toLocaleDateString()}</p>
                </div>
              ))}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </div>
  );
}

export default AccountInfo;
