import React, { useState, useEffect } from "react";
import { Table, Tag, Space, Button, Avatar, Pagination, Tabs } from "antd";
import { useNavigate } from "react-router-dom"; 
import { fetchAllProjects } from "../service/Project";
import "../assets/style/Pages/ProjectManagement.scss";

const { TabPane } = Tabs;

const statusColors = {
  COMPLETED: "green",
  ONGOING: "blue",
  "NOT STARTED": "orange",
};

const ProjectManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredStatus, setFilteredStatus] = useState("All Projects");
  const [data, setData] = useState([]);
  const pageSize = 10;
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      const projects = await fetchAllProjects();
      setData(projects);
    };
    fetchData();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTabChange = (key) => {
    setFilteredStatus(key);
    setCurrentPage(1); // Reset to the first page when changing tabs
  };

  const filteredData = data.filter((item) => {
    if (filteredStatus === "All Projects") return true;
    return item.status === filteredStatus.toUpperCase();
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Project Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate", 
    },
    {
      title: "Client Name",
      dataIndex: "clientName",
      key: "clientName",
      render: (client) => (
        <Space>
          <Avatar src="path-to-client-avatar" />
          {client}
        </Space>
      ),
    },
    {
      title: "Project Manager",
      dataIndex: "projectManager",
      key: "projectManager",
      render: (personInCharge) => (
        <Space>
          <Avatar src="path-to-person-avatar" />
          {personInCharge}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status]} key={status}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#fff" }}>
      <Button type="primary" onClick={() => navigate("/new-project")}>
        New Project
      </Button>
      <Tabs defaultActiveKey="All Projects" onChange={handleTabChange} centered>
        <TabPane tab="All Projects" key="All Projects" />
        <TabPane tab="Ongoing" key="Ongoing" />
        <TabPane tab="Not Started" key="Not Started" />
        <TabPane tab="Completed" key="Completed" />
      </Tabs>
      <Table 
        columns={columns} 
        dataSource={paginatedData} 
        pagination={false} 
        onRow={(record) => {
          return {
            onClick: () => navigate(`/project/${record.key}`),
          };
        }}
      />
      <div style={{ marginTop: "16px", textAlign: "right" }}>
        <Pagination
          current={currentPage}
          total={filteredData.length}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ProjectManagement;