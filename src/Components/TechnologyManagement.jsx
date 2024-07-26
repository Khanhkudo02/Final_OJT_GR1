import React, { useState, useEffect } from "react";
import { Button, Table, message } from "antd";
import ModalAddTechnology from "./ModalAddTechnology";
import ModalEditTechnology from "./ModalEditTechnology";
import ModalDeleteTechnology from "./ModalDeleteTechnology";
import { fetchAllTechnology } from "../service/TechnologyServices";
import "../assets/style/Pages/TechnologyManagement.scss";

const { Column } = Table;

const TechnologyManagement = () => {
  const [technologies, setTechnologies] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dataTechnologyEdit, setDataTechnologyEdit] = useState(null);
  const [technologyIdToDelete, setTechnologyIdToDelete] = useState(null);

  // Function to fetch technologies and update state
  const loadTechnologies = async () => {
    try {
      const data = await fetchAllTechnology();
      setTechnologies(data);
    } catch (error) {
      console.error("Failed to fetch technologies:", error);
    }
  };

  // Load technologies when component mounts
  useEffect(() => {
    loadTechnologies();
  }, []);

  // Show edit modal with technology data
  const showEditModal = (record) => {
    setDataTechnologyEdit(record);
    setIsEditModalOpen(true);
  };

  // Show add modal
  const showAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Show delete modal if technology is inactive
  const showDeleteModal = (record) => {
    if (record.status && record.status.toLowerCase() === "inactive") {
      setTechnologyIdToDelete(record.key); // Make sure `record.key` is the correct ID
      setIsDeleteModalOpen(true);
    } else {
      message.error("Only inactive technologies can be deleted.");
    }
  };

  // Close edit modal and reload technologies
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setDataTechnologyEdit(null);
    setTimeout(loadTechnologies, 100);
  };

  // Close add modal and reload technologies
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setTimeout(loadTechnologies, 100);
  };

  // Close delete modal and reload technologies
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTechnologyIdToDelete(null);
    setTimeout(loadTechnologies, 100);
  };

  // Define columns for Table
  const columns = [
    {
      title: "Image",
      dataIndex: "imageURL",
      key: "imageURL",
      render: (text) => <img src={text} alt="Technology" style={{ width: 50, height: 50 }} />,
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
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => showEditModal(record)}
          >
            Edit
          </Button>
          <Button type="danger" onClick={() => showDeleteModal(record)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={showAddModal}>
        Add Technology
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
