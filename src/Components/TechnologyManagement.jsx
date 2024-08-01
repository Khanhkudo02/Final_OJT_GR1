import React, { useState, useEffect } from "react";
import { Button, Table, message, Modal, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { fetchAllTechnology, deleteTechnology } from "../service/TechnologyServices";
import { useNavigate } from "react-router-dom";
import "../assets/style/Pages/TechnologyManagement.scss";
import "../assets/style/Global.scss";

const { Column } = Table;
const { confirm } = Modal;

const TechnologyManagement = () => {
  const [technologies, setTechnologies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const loadTechnologies = async () => {
    try {
      const data = await fetchAllTechnology();
      const techArray = Object.keys(data).map((key) => ({
        key,  // Add the key as the ID
        ...data[key],  // Spread the data
      }));
      setTechnologies(techArray);
    } catch (error) {
      console.error("Failed to fetch technologies:", error);
    }
  };

  useEffect(() => {
    loadTechnologies();

    const technologyAdded = localStorage.getItem("technologyAdded");
    if (technologyAdded === "true") {
      message.success("Technology added successfully!");
      localStorage.removeItem("technologyAdded"); // Clear notification after displaying
    }
  }, []);

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const showAddPage = () => {
    navigate("/technology-management/add");
  };

  const handleDelete = (record) => {
    if (record.status.toLowerCase() !== "inactive") {
      message.error("Only inactive technologies can be deleted.");
      return;
    }

    confirm({
      title: "Are you sure you want to delete this technology?",
      onOk: async () => {
        try {
          await deleteTechnology(record.key);
          message.success("Technology deleted successfully!");
          loadTechnologies();
        } catch (error) {
          message.error("Failed to delete technology.");
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const paginatedData = technologies.slice(
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
      >
        Add New Technology
      </Button>
      <Table
        dataSource={paginatedData}
        rowKey="key"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: technologies.length,
          onChange: (page, pageSize) =>
            handleTableChange({ current: page, pageSize }),
        }}
      >
        <Column
          title="Image"
          dataIndex="imageUrl"
          key="imageUrl"
          render={(imageUrl) => (
            imageUrl ? <img src={imageUrl} alt="Technology" style={{ width: 50, height: 50 }} /> : <span>No Image</span>
          )}
        />
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column
          title="Status"
          dataIndex="status"
          key="status"
          render={(text) => {
            const className = text === "active" ? "status-active" : "status-inactive";
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
                icon={<EditOutlined />}
                style={{ color: "blue", borderColor: "blue" }}
                onClick={() => navigate(`/technology-management/edit/${record.key}`)}
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

export default TechnologyManagement;