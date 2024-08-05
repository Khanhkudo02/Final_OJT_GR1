import { Button, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from "react-router-dom";
import { fetchEmployeeById, fetchAllPositions, fetchAllSkills } from "../service/EmployeeServices";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const data = await fetchEmployeeById(id);
        setEmployee(data);
      } catch (error) {
        message.error(t("failedToFetchEmployeeDetails"));
      } finally {
        setLoading(false);
      }
    };

    const loadPositions = async () => {
      try {
        const positionsData = await fetchAllPositions();
        setPositions(positionsData.map((pos) => ({ key: pos.key, name: pos.label }))); // Adjust based on your data structure
      } catch (error) {
        message.error(t("failedToFetchPositions"));
      }
    };

    loadEmployee();
    loadPositions();
  }, [id, t]);

  const getPositionNameById = (positionId, positions) => {
    const position = positions.find((pos) => pos.key === positionId);
    return position ? position.name : t("unknownPosition");
  };

  if (loading) return <Spin size="large" />;

  const formatSkill = (skill) =>
    skill
      .replace(/_/g, " ") // Thay thế dấu gạch dưới bằng dấu cách
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const formattedSkills = Array.isArray(employee.skills)
    ? employee.skills.map(formatSkill).join(", ")
    : employee.skills
      ? formatSkill(employee.skills)
      : t("noSkills");

  const formatDepartment = (department) => {
    if (typeof department === "string") {
      return department
        .replace(/_/g, " ") // Thay dấu "_" bằng dấu cách
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Viết hoa chữ cái đầu
    }
    return department; // Nếu department không phải là chuỗi, trả về giá trị gốc
  };

  return (
    <div className="employee-details">
      <h2>{t('employeeDetails')}</h2>
      {employee ? (
        <div>
          {employee.imageUrl && (
            <div>
              <strong>{t('image')}:</strong>
              <img
                src={employee.imageUrl}
                alt={t('employeeImage')}
                width="100"
                height="100"
                style={{ objectFit: "cover", marginLeft: "10px" }}
              />
            </div>
          )}
          <p>
            <strong>{t('name')}:</strong> {employee.name}
          </p>
          <p>
            <strong>{t('email')}:</strong> {employee.email}
          </p>
          <p>
            <strong>{t('phoneNumber')}:</strong> {employee.phoneNumber}
          </p>
          <p>
            <strong>{t('skills')}:</strong> {formattedSkills}
          </p>
          <p>
            <strong>{t('department')}:</strong> {formatDepartment(employee.department)}
          </p>
          <p>
            <strong>{t('position')}:</strong> {getPositionNameById(employee.position, positions)}
          </p>
          <p>
            <strong>{t('status')}:</strong>
            <span
              className={
                employee.status === "active"
                  ? "status-active"
                  : "status-inactive"
              }
            >
              {employee.status
                ? employee.status.charAt(0).toUpperCase() +
                employee.status.slice(1)
                : ""}
            </span>
          </p>
          <Button
            type="primary"
            onClick={() => navigate("/employee-management")}
            style={{ marginTop: "16px" }}
          >
            {t('backToEmployeeManagement')}
          </Button>
        </div>
      ) : (
        <p>{t('employeeNotFound')}</p>
      )}
    </div>
  );
};

export default EmployeeDetails;
