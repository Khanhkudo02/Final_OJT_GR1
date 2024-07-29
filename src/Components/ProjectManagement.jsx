import React, { useState, useEffect } from "react";
import { Table, Tag, Space, Button, Avatar, Pagination, Tabs } from "antd";
import { useNavigate } from "react-router-dom"; 
import { fetchAllProjects } from "../service/Project";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import "../assets/style/Pages/ProjectManagement.scss";
import "../assets/style/Global.scss"

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

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRandomColor = () => {
    const colors = [
      "#f56a00", "#7265e6", "#ffbf00", "#00a2ae", "#eb2f96", "#7cb305",
      "#13c2c2", "#096dd9", "#f5222d", "#fa8c16", "#fa541c", "#52c41a"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const columns = [
    {
      title: "Project Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => {
        if (!date) return '';
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('en-GB');
      },
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => {
        if (!date) return '';
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('en-GB');
      },
    },
    {
      title: "Project Manager",
      dataIndex: "projectManager",
      key: "projectManager",
      className: "text-align-start",
      render: (personInCharge) => (
        <div className="text-align-start">
          <Space>
            <Avatar style={{ backgroundColor: getRandomColor() }}>
              {getInitials(personInCharge)}
            </Avatar>
            {personInCharge}
          </Space>
        </div>
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
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button 
            icon={<EyeOutlined />} 
            style={{ color: "green", borderColor: "green" }} 
            onClick={() => navigate(`/project/${record.key}`)}
          />
          <Button 
            icon={<EditOutlined />} 
            style={{ color: "blue", borderColor: "blue" }} 
            onClick={() => navigate(`/edit-project/${record.key}`)}
          />
          {record.status !== "ONGOING" && (
            <Button 
              icon={<DeleteOutlined />} 
              style={{ color: "red", borderColor: "red" }} 
              onClick={() => console.log('Delete', record.key)}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#fff" }}>
      <Button 
        className="btn" 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={() => navigate("/new-project")}
      />
      <Tabs defaultActiveKey="All Projects" onChange={handleTabChange} centered>
        <TabPane tab="All Projects" key="All Projects" />
        <TabPane tab="Ongoing" key="Ongoing" />
        <TabPane tab="Not Started" key="Not Started" />
        <TabPane tab="Completed" key="Completed" />
        <TabPane tab="Pending" key="Pending" />
      </Tabs>
      <Table 
        columns={columns} 
        dataSource={paginatedData} 
        pagination={false} 
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
