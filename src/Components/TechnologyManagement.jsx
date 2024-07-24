import React, { useState, useEffect } from 'react';
import { Button, Table, message } from 'antd';
import ModalAddTechnology from './ModalAddTechnology';
import ModalEditTechnology from './ModalEditTechnology';
import ModalDeleteTechnology from './ModalDeleteTechnology';
import { fetchAllTechnology } from "../service/TechnologyServices";
import "../assets/style/Pages/TechnologyManagement.scss";

const { Column } = Table;

const TechnologyManagement = () => {
  const [technologies, setTechnologies] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [dataTechnologyEdit, setDataTechnologyEdit] = useState(null);
  const [technologyIdToDelete, setTechnologyIdToDelete] = useState(null);
  const [dataTechnologyView, setDataTechnologyView] = useState(null);

  const loadTechnologies = async () => {
    try {
      const data = await fetchAllTechnology();
      setTechnologies(data);
    } catch (error) {
      console.error("Failed to fetch technologies:", error);
    }
  };

  useEffect(() => {
    loadTechnologies();
  }, []);

  const showEditModal = (record) => {
    setDataTechnologyEdit(record);
    setIsEditModalVisible(true);
  };

  const showDeleteModal = (record) => {
    if (record.status && record.status.toLowerCase() === "inactive") {
      setTechnologyIdToDelete(record);
      setIsDeleteModalVisible(true);
    } else {
      message.error("Only inactive technologies can be deleted.");
    }
  };

  const showViewModal = (record) => {
    setDataTechnologyView(record);
    setIsViewModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setDataTechnologyEdit(null);
    setTimeout(loadTechnologies, 100);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setTechnologyIdToDelete(null);
    setTimeout(loadTechnologies, 100);
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setDataTechnologyView(null);
  };

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={showAddModal}>
        Add New Technology
      </Button>
      <Table dataSource={technologies} pagination={false}>
        <Column
          title="Image"
          dataIndex="imageUrl"
          key="imageUrl"
          render={(text, record) => (
            <img
              src={record.imageUrl}
              alt={record.name}
              style={{ width: 50, height: 50 }}
            />
          )}
        />
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column
          title="Status"
          dataIndex="status"
          key="status"
          render={(text) => text.charAt(0).toUpperCase() + text.slice(1)}
        />
        <Column
          title="Actions"
          key="actions"
          render={(text, record) => (
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
              <Button type="default" onClick={() => showViewModal(record)}>
                View
              </Button>
            </span>
          )}
        />
      </Table>
      {dataTechnologyEdit && (
        <ModalEditTechnology
          open={isEditModalVisible}
          handleClose={handleCloseEditModal}
          dataTechnologyEdit={dataTechnologyEdit}
        />
      )}
      {technologyIdToDelete && (
        <ModalDeleteTechnology
          open={isDeleteModalVisible}
          handleClose={handleCloseDeleteModal}
          dataTechnologyDelete={technologyIdToDelete}
        />
      )}
      {dataTechnologyView && (
        <Modal
          title="View Technology"
          visible={isViewModalVisible}
          onCancel={handleCloseViewModal}
          footer={[
            <Button key="back" onClick={handleCloseViewModal}>
              Close
            </Button>,
          ]}
        >
          <p><strong>Name:</strong> {dataTechnologyView.name}</p>
          <p><strong>Description:</strong> {dataTechnologyView.description}</p>
          <p><strong>Status:</strong> {dataTechnologyView.status}</p>
          {dataTechnologyView.imageUrl && (
            <img
              src={dataTechnologyView.imageUrl}
              alt={dataTechnologyView.name}
              style={{ width: 100, height: 100 }}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default TechnologyManagement;
