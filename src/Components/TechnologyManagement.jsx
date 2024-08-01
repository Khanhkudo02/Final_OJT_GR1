import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Space, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import "../assets/style/Global.scss";
import "../assets/style/Pages/TechnologyManagement.scss";
import { fetchAllTechnology } from "../service/TechnologyServices";
import ModalAddTechnology from "./ModalAddTechnology";
import ModalDeleteTechnology from "./ModalDeleteTechnology";
import ModalEditTechnology from "./ModalEditTechnology";

const TechnologyManagement = () => {
  const [technologies, setTechnologies] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dataTechnologyEdit, setDataTechnologyEdit] = useState(null);
  const [technologyIdToDelete, setTechnologyIdToDelete] = useState(null);

  const loadTechnologies = async () => {
    try {
      const data = await fetchAllTechnology();
      setTechnologies(data.sort((a, b) => b.createdAt - a.createdAt));
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
    setTimeout(loadTechnologies, 100);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setTimeout(loadTechnologies, 100);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTechnologyIdToDelete(null);
    setTimeout(loadTechnologies, 100);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imageURLs",
      key: "imageURLs",
      render: (urls) => (
        Array.isArray(urls) && urls.length > 0 ? (
          <img src={urls[0]} alt="Technology" style={{ width: 50, height: 50 }} />
        ) : null
      ),
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
        const className = text === "active" ? "status-active" : "status-inactive";
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
      <Button className="btn" type="primary" onClick={showAddModal} icon={<PlusOutlined />}>
      </Button>
      <Table
        columns={columns}
        dataSource={technologies}
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
