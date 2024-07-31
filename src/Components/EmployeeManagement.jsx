import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, message, Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/style/Global.scss";
import "../assets/style/Pages/EmployeeManagement.scss";
import {
  deleteEmployeeById,
  fetchAllEmployees,
} from "../service/EmployeeServices";

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
      // Filter employees to only include those with role 'employee'
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
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Phone Number" dataIndex="phoneNumber" key="phoneNumber" />
        <Column title="Skills" dataIndex="skills" key="skills" />
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
            <span>
              <Button
                className="edit-button"
                type="primary"
                onClick={() =>
                  navigate(`/employee-management/edit/${record.key}`)
                }
                style={{ marginLeft: 8 }}
              >
                <EditOutlined />
              </Button>
              <Button
                className="delete-button"
                type="danger"
                onClick={() => handleDelete(record)}
                style={{ marginLeft: 8 }}
              >
                <DeleteOutlined />
              </Button>
            </span>
          )}
        />
      </Table>
    </div>
  );
};

export default EmployeeManagement;
