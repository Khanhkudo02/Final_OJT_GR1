import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Avatar,
  Pagination,
  Tabs,
  Input,
} from "antd";
import { useNavigate } from "react-router-dom";
import { fetchEmployeeProjects } from "../service/Project";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import "../assets/style/Pages/ProjectManagement.scss";
import "../assets/style/Global.scss";
import { useTranslation } from "react-i18next";

const statusColors = {
  COMPLETED: "green",
  ONGOING: "blue",
  "NOT STARTED": "orange",
  PENDING: "yellow",
};

const EmployeeProjectManagement = ({ employeeId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredStatus, setFilteredStatus] = useState("All Projects");
  const [data, setData] = useState([]);
  const pageSize = 10;
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      if (employeeId) {
        const projects = await fetchEmployeeProjects(employeeId);
        setData(projects.reverse());
      }
    };
    fetchData();
  }, [employeeId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTabChange = (key) => {
    setFilteredStatus(key);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = data.filter((item) => {
    const matchesStatus =
      filteredStatus === "All Projects" ||
      item.status === filteredStatus.toUpperCase();
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.projectManager &&
        item.projectManager.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
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

  const formatBudget = (value) => {
    if (typeof value !== "string") {
      value = String(value);
    }
    if (!value) return "";

    const hasDollarSign = value.startsWith("$");
    const hasVND = value.endsWith("VND");

    let numericValue = value.replace(/[^\d]/g, "");
    numericValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (hasDollarSign) {
      numericValue = `$${numericValue}`;
    }
    if (hasVND) {
      numericValue = `${numericValue}VND`;
    }

    return numericValue;
  };

  const columns = [
    {
      title: "Tên dự án",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => {
        if (!date) return "";
        const dateObj = moment(date);
        return dateObj.isValid()
          ? dateObj.format("DD/MM/YYYY")
          : "Ngày không hợp lệ";
      },
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => {
        if (!date) return "";
        const dateObj = moment(date);
        return dateObj.isValid()
          ? dateObj.format("DD/MM/YYYY")
          : "Ngày không hợp lệ";
      },
    },
    {
      title: "Quản lý dự án",
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
      title: "Ngân sách",
      dataIndex: "budget",
      key: "budget",
      render: formatBudget,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColors[status]} key={status}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            style={{ color: "green", borderColor: "green" }}
            onClick={() => navigate(`/project/${record.key}`)}
          />
        </Space>
      ),
    },
  ];

  const tabItems = [
    { key: "All Projects", label: "Tất cả dự án" },
    { key: "Ongoing", label: "Đang diễn ra" },
    { key: "Not Started", label: "Chưa bắt đầu" },
    { key: "Completed", label: "Hoàn thành" },
    { key: "Pending", label: "Đang chờ" },
  ];

  return (
    <div style={{ padding: "24px", background: "#fff" }}>
      <div className="project-management-header">
        <Input
          placeholder={t("search")}
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ width: "250px", marginBottom: 16 }}
          prefix={<SearchOutlined />}
        />
      </div>
      <Tabs
        defaultActiveKey="All Projects"
        onChange={handleTabChange}
        items={tabItems}
        centered
      />
      <Table
        columns={columns}
        dataSource={paginatedData}
        pagination={false}
        rowKey="key"
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

export default EmployeeProjectManagement;
