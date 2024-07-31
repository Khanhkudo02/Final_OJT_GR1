import React, { useState, useEffect } from "react";
import { Button, Table, message, Modal, Space } from "antd";
import { fetchAllEmployees, deleteEmployeeById } from "../service/EmployeeServices";
import { useNavigate } from "react-router-dom";
import "../assets/style/Pages/EmployeeManagement.scss";
import "../assets/style/Global.scss";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Column } = Table;
const { confirm } = Modal;

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const loadEmployees = async () => {
    try {
      const data = await fetchAllEmployees();
      const filteredData = data.filter(employee => employee.role === 'employee');
      setEmployees(filteredData);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  useEffect(() => {
    loadEmployees();

    const employeeAdded = localStorage.getItem("employeeAdded");
    if (employeeAdded === "true") {
      message.success("Employee added successfully!");
      localStorage.removeItem("employeeAdded");
    }
  }, []);

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const showAddPage = () => {
    navigate("/employee-management/add");
  };

  const handleDelete = (record) => {
    if (record.status !== "inactive") {
      message.error("Only inactive employees can be deleted.");
      return;
    }

    confirm({
      title: "Are you sure you want to delete this employee?",
      onOk: async () => {
        try {
          await deleteEmployeeById(record.key);
          message.success("Employee deleted successfully!");
          loadEmployees();
        } catch (error) {
          message.error("Failed to delete employee.");
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
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
      >
       
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
          title="Image"
          dataIndex="imageUrl"
          key="imageUrl"
          render={(text, record) => (
            <img
              src={record.imageUrl}
              alt="Employee"
              width="50"
              height="50"
              style={{ objectFit: "cover" }}
            />
          )}
        />
        <Column className="length-cell" title="Name" dataIndex="name" key="name" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Phone Number" dataIndex="phoneNumber" key="phoneNumber" />
        <Column
          className="length-cell"
          title="Skills"
          dataIndex="skills"
          key="skills"
          render={(text) => {
            if (Array.isArray(text)) {
              return text
                .map(skill => 
                  skill
                    .replace(/_/g, ' ')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ')
                )
                .join(', ');
            }
            return text;
          }}
        />

        <Column
          title="Status"
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
          title="Actions"
          key="actions"
          render={(text, record) => (
            <Space>
              <Button
                icon={<EyeOutlined />}
                style={{ color: "green", borderColor: "green" }}
                onClick={() => navigate(`/employee-management/view/${record.key}`)}
              />
              <Button
                icon={<EditOutlined />}
                style={{ color: "blue", borderColor: "blue" }}
                onClick={() => navigate(`/employee-management/edit/${record.key}`)}
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
