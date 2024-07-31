import React, { useState, useEffect } from "react";
import { Button, Table, message, Modal, Space } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";
import {
  fetchAllEmployees,
  deleteEmployeeById,
} from "../service/EmployeeServices";
import "../assets/style/Pages/EmployeeManagement.scss";
import "../assets/style/Global.scss";

const { Column } = Table;
const { confirm } = Modal;

const EmployeeManagement = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const loadEmployees = async () => {
    try {
      const data = await fetchAllEmployees();
      const filteredData = data
        .filter((employee) => employee.role === "employee")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sắp xếp theo createdAt
      setEmployees(filteredData);
    } catch (error) {
      console.error(t("errorFetchingEmployees"), error);
    }
  };

  useEffect(() => {
    loadEmployees();

    const employeeAdded = localStorage.getItem("employeeAdded");
    if (employeeAdded === "true") {
      message.success(t("employeeAddedSuccessfully"));
      localStorage.removeItem("employeeAdded");
    }
  }, [t]);

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const showAddPage = () => {
    navigate("/employee-management/add");
  };

  const handleDelete = (record) => {
    if (record.status !== "inactive") {
      message.error(t("onlyInactiveEmployeesCanBeDeleted"));
      return;
    }

    confirm({
      title: t("confirmDeleteEmployee"),
      onOk: async () => {
        try {
          await deleteEmployeeById(record.key);
          message.success(t("employeeDeletedSuccessfully"));
          loadEmployees();
        } catch (error) {
          message.error(t("failedToDeleteEmployee"));
        }
      },
      onCancel() {
        console.log(t("cancel"));
      },
    });
  };

  const exportToExcel = () => {
    const filteredEmployees = employees.map(
      ({ key, createdAt, password, imageUrl, isAdmin, ...rest }) => rest
    );

    const ws = XLSX.utils.json_to_sheet(filteredEmployees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t("employees"));
    XLSX.writeFile(wb, `${t("employees")}.xlsx`);
  };

  const paginatedData = employees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <Button
        className="btn"
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={showAddPage}
        icon={<PlusOutlined />}
      ></Button>
      <Button
        className="btn"
        type="primary"
        style={{ marginBottom: 16, marginLeft: 16 }}
        onClick={exportToExcel}
      >
        {t("exportToExcel")}
      </Button>
      <Table
        dataSource={paginatedData}
        rowKey="key"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: employees.length,
          onChange: (page, pageSize) =>
            handleTableChange({ current: page, pageSize }),
        }}
      >
        <Column
          title={t("image")}
          dataIndex="imageUrl"
          key="imageUrl"
          render={(text, record) => (
            <img
              src={record.imageUrl}
              alt={t("employee")}
              width="50"
              height="50"
              style={{ objectFit: "cover" }}
            />
          )}
        />
        <Column title={t("name")} dataIndex="name" key="name" />
        <Column title={t("email")} dataIndex="email" key="email" />
        <Column
          title={t("phoneNumber")}
          dataIndex="phoneNumber"
          key="phoneNumber"
        />
        <Column
          title={t("skills")}
          dataIndex="skills"
          key="skills"
          render={(text) => {
            if (Array.isArray(text)) {
              return text
                .map((skill) =>
                  skill
                    .replace(/_/g, " ")
                    .split(" ")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ")
                )
                .join(", ");
            }
            return text;
          }}
        />
        <Column
          title={t("status")}
          dataIndex="status"
          key="status"
          render={(text) => {
            const className =
              text === "active" ? "status-active" : "status-inactive";
            return (
              <span className={className}>
                {text ? text.charAt(0).toUpperCase() + text.slice(1) : ""}
              </span>
            );
          }}
        />
        <Column
          title={t("actions")}
          key="actions"
          render={(text, record) => (
            <Space>
              <Button
                icon={<EyeOutlined />}
                style={{ color: "green", borderColor: "green" }}
                onClick={() =>
                  navigate(`/employee-management/view/${record.key}`)
                }
              />
              <Button
                icon={<EditOutlined />}
                style={{ color: "blue", borderColor: "blue" }}
                onClick={() =>
                  navigate(`/employee-management/edit/${record.key}`)
                }
              />
              <Button
                icon={<DeleteOutlined />}
                style={{ color: "red", borderColor: "red" }}
                onClick={() => handleDelete(record)}
              />
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default EmployeeManagement;
