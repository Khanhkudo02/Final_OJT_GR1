import React, { useState } from "react";
import { Table, Tag, Space, Button, Avatar, Pagination, Tabs } from "antd";
import { Link } from "react-router-dom";
import "../assets/style/Pages/ProjectManagement.scss";

const { TabPane } = Tabs;

const data = [
  {
    key: "1",
    id: "#PRJ2023-08-56789",
    name: "Create Illustration For Website",
    createdDate: "Aug 18th, 2023",
    deadline: "Oct 15th, 2023",
    client: "Ava Williams",
    personInCharge: "Mia Rodriggit uez",
    status: "COMPLETED",
  },
  {
    key: "2",
    id: "#PRJ2023-15-98765",
    name: "Create Animation For App",
    createdDate: "Aug 16th, 2023",
    deadline: "Oct 11th, 2023",
    client: "Isabella",
    personInCharge: "Caleb Parker",
    status: "ONGOING",
  },
  {
    key: "3",
    id: "#PRJ2023-15-98765",
    name: "OJT",
    createdDate: "Aug 16th, 2023",
    deadline: "Oct 11th, 2023",
    client: "Isabella",
    personInCharge: "MR. Thuoc",
    status: "ONGOING",
  },
  {
    key: "4",
    id: "#PRJ2023-15-12345",
    name: "OJT",
    createdDate: "Aug 16th, 2023",
    deadline: "Oct 11th, 2023",
    client: "Isabella",
    personInCharge: "MR. Nguyen",
    status: "NOT STARTED",
  },
  // Add more data as necessary
];

const statusColors = {
  COMPLETED: "green",
  ONGOING: "blue",
  "NOT STARTED": "orange",
};

const ProjectManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredStatus, setFilteredStatus] = useState("All Projects");
  const pageSize = 10;

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
      render: (text) => <Link to={`/project/${text}`}>{text}</Link>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
    },
    {
      title: "Deadline",
      dataIndex: "deadline",
      key: "deadline",
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
      render: (client) => (
        <Space>
          <Avatar src="path-to-client-avatar" />
          {client}
        </Space>
      ),
    },
    {
      title: "Person in Charge",
      dataIndex: "personInCharge",
      key: "personInCharge",
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
      <Button type="primary">New Project</Button>
      <Tabs defaultActiveKey="All Projects" onChange={handleTabChange} centered>
        <TabPane tab="All Projects" key="All Projects" />
        <TabPane tab="Ongoing" key="Ongoing" />
        <TabPane tab="Not Started" key="Not Started" />
        <TabPane tab="Completed" key="Completed" />
      </Tabs>
      <Table columns={columns} dataSource={paginatedData} pagination={false} />
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
