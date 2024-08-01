import React, { useState, useEffect } from "react";
import { Table, Tag, Space, Button, Avatar, Pagination, Tabs, Modal, message } from "antd";
import { useNavigate } from "react-router-dom"; 
import { fetchAllProjects, moveToArchive } from "../service/Project";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, InboxOutlined } from "@ant-design/icons";
import moment from "moment"; // Thêm moment.js để xử lý định dạng ngày tháng
import "../assets/style/Pages/ProjectManagement.scss";
import "../assets/style/Global.scss";

const statusColors = {
  COMPLETED: "green",
  ONGOING: "blue",
  "NOT STARTED": "orange",
  PENDING: "yellow"
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
      setData(projects.reverse());
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
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRandomColor = () => {
    const colors = [
      "#f56a00",
      "#7265e6",
      "#ffbf00",
      "#00a2ae",
      "#eb2f96",
      "#7cb305",
      "#13c2c2",
      "#096dd9",
      "#f5222d",
      "#fa8c16",
      "#fa541c",
      "#52c41a",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleDelete = (key) => {
    Modal.confirm({
      title: 'Are you sure you want to archive this project?',
      onOk: async () => {
        try {
          await moveToArchive(key);
          setData(prevData => prevData.filter(item => item.key !== key));
          message.success('Project archived successfully');
        } catch (error) {
          message.error('Failed to archive project');
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
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => {
        if (!date) return "";
        const dateObj = moment(date); // Sử dụng moment để chuyển đổi định dạng ngày tháng
        return dateObj.isValid() ? dateObj.format("DD/MM/YYYY") : "Invalid Date";
      },
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => {
        if (!date) return "";
        const dateObj = moment(date); // Sử dụng moment để chuyển đổi định dạng ngày tháng
        return dateObj.isValid() ? dateObj.format("DD/MM/YYYY") : "Invalid Date";
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
              onClick={() => handleDelete(record.key)}
            />
          )}
        </Space>
      ),
    },
  ];

  // Tabs items
  const tabItems = [
    { key: "All Projects", label: "All Projects" },
    { key: "Ongoing", label: "Ongoing" },
    { key: "Not Started", label: "Not Started" },
    { key: "Completed", label: "Completed" },
    { key: "Pending", label: "Pending" },
  ];

  return (
    <div style={{ padding: "24px", background: "#fff" }}>
      <div className="project-management-header">
        <Button 
          className="btn" 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => navigate("/new-project")}
        />
        <Button 
          type="default" 
          icon={<InboxOutlined />} 
          onClick={() => navigate("/archived-projects")}
          style={{ marginLeft: "auto" }}
        />
      </div>
      <Tabs defaultActiveKey="All Projects" onChange={handleTabChange} items={tabItems} centered />
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
