import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tabs, message } from "antd";
import React, { useEffect, useState } from "react";
import "../assets/style/Global.scss";
import "../assets/style/Pages/TechnologyManagement.scss";
import { fetchAllTechnology } from "../service/TechnologyServices";
import ModalAddTechnology from "./ModalAddTechnology";
import ModalDeleteTechnology from "./ModalDeleteTechnology";
import ModalEditTechnology from "./ModalEditTechnology";

const TechnologyManagement = () => {
  const [technologies, setTechnologies] = useState([]);
  const [data, setData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dataTechnologyEdit, setDataTechnologyEdit] = useState(null);
  const [technologyIdToDelete, setTechnologyIdToDelete] = useState(null);
  const [filteredStatus, setFilteredStatus] = useState("All Techniques");

  const loadTechnologies = async () => {
    try {
      const fetchedData = await fetchAllTechnology();
      setData(
        fetchedData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
      setTechnologies(fetchedData);
    } catch (error) {
      console.error("Failed to fetch technologies:", error);
    }
  };

  useEffect(() => {
    loadTechnologies();
  }, []);

  const showEditModal = (record) => {
    setDataTechnologyEdit(record);
    setIsEditModalOpen(true);
  };

  const showAddModal = () => {
    setIsAddModalOpen(true);
  };

  const showDeleteModal = (record) => {
    if (record.status && record.status.toLowerCase() === "inactive") {
      setTechnologyIdToDelete(record.key);
      setIsDeleteModalOpen(true);
    } else {
      message.error("Only inactive technologies can be deleted.");
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setDataTechnologyEdit(null);
    loadTechnologies(); // Refresh the data without timeout
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    loadTechnologies(); // Refresh the data without timeout
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTechnologyIdToDelete(null);
    loadTechnologies(); // Refresh the data without timeout
  };

  const handleTabChange = (key) => {
    setFilteredStatus(key);
  };

  const filteredData = data.filter((item) => {
    if (filteredStatus === "All Techniques") return true;
    return item.status.toLowerCase() === filteredStatus.toLowerCase();
  });

  const tabItems = [
    { key: "All Techniques", label: "All Techniques" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
  ];

  const columns = [
    {
      title: "Image",
      dataIndex: "imageURLs",
      key: "imageURLs",
      render: (urls) =>
        Array.isArray(urls) && urls.length > 0 ? (
          <img
            src={urls[0]}
            alt="Technology"
            style={{ width: 50, height: 50 }}
          />
        ) : null,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        const className =
          text.toLowerCase() === "active" ? "status-active" : "status-inactive";
        return (
          <span className={className}>
            {text ? text.charAt(0).toUpperCase() + text.slice(1) : ""}
          </span>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            style={{ color: "blue", borderColor: "blue" }}
            onClick={() => showEditModal(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            style={{ color: "red", borderColor: "red" }}
            onClick={() => showDeleteModal(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        className="btn"
        type="primary"
        onClick={showAddModal}
        icon={<PlusOutlined />}
      >
        Add Technology
      </Button>
      <Tabs
        defaultActiveKey="All Techniques"
        onChange={handleTabChange}
        items={tabItems}
        centered
      />
      <Table
        columns={columns}
        dataSource={filteredData} // Use filtered data here
        rowKey={(record) => record.key}
      />
      {isAddModalOpen && (
        <ModalAddTechnology
          open={isAddModalOpen}
          handleClose={handleCloseAddModal}
        />
      )}
      {isEditModalOpen && (
        <ModalEditTechnology
          open={isEditModalOpen}
          handleClose={handleCloseEditModal}
          dataTechnologyEdit={dataTechnologyEdit}
        />
      )}
      {isDeleteModalOpen && (
        <ModalDeleteTechnology
          open={isDeleteModalOpen}
          handleClose={handleCloseDeleteModal}
          technologyIdToDelete={technologyIdToDelete}
        />
      )}
    </div>
  );
};

export default TechnologyManagement;
