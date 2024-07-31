import React, { useState, useEffect } from "react";
import { Table, Space, Button, Pagination, message, Modal } from "antd";
import { useNavigate } from "react-router-dom"; 
import { fetchArchivedProjects, deleteProjectPermanently, restoreProject } from "../service/Project";
import { DeleteOutlined, RollbackOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import "../assets/style/Global.scss";

const ArchivedProjects = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const pageSize = 10;
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projects = await fetchArchivedProjects();
        setData(projects);
      } catch (error) {
        message.error('Failed to fetch archived projects');
        console.error('Failed to fetch archived projects:', error);
      }
    };
    fetchData();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleDelete = (key) => {
    Modal.confirm({
      title: 'Are you sure you want to permanently delete this project?',
      onOk: async () => {
        try {
          await deleteProjectPermanently(key);
          setData(prevData => prevData.filter(item => item.key !== key));
          message.success('Project permanently deleted');
        } catch (error) {
          message.error('Failed to delete project');
          console.error('Failed to delete project:', error);
        }
      }
    });
  };

  const handleRestore = (key) => {
    Modal.confirm({
      title: 'Are you sure you want to restore this project?',
      onOk: async () => {
        try {
          await restoreProject(key);
          setData(prevData => prevData.filter(item => item.key !== key));
          message.success('Project restored successfully');
        } catch (error) {
          message.error('Failed to restore project');
          console.error('Failed to restore project:', error);
        }
      }
    });
  };

  const columns = [
    {
      title: "Project Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button 
            icon={<RollbackOutlined />} 
            style={{ color: "blue", borderColor: "blue" }} 
            onClick={() => handleRestore(record.key)}
          />
          <Button 
            icon={<DeleteOutlined />} 
            style={{ color: "red", borderColor: "red" }} 
            onClick={() => handleDelete(record.key)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#fff" }}>
      <Button 
        type="default" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate("/project-management")}
        style={{ marginBottom: "16px" }}
      >
        Back to Project Management
      </Button>
      <Table 
        columns={columns} 
        dataSource={paginatedData} 
        pagination={false} 
      />
      <div style={{ marginTop: "16px", textAlign: "right" }}>
        <Pagination
          current={currentPage}
          total={data.length}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ArchivedProjects;
