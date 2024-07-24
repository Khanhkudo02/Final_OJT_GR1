import React, { useState, useEffect } from 'react';
import { Button, Table, message } from 'antd';
import ModalAddTechnology from './ModalAddTechnology';
import ModalEditTechnology from './ModalEditTechnology';
import ModalDeleteTechnology from './ModalDeleteTechnology';
import { fetchAllTechnology } from "../service/TechnologyServices";

const { Column } = Table;

const TechnologyManagement = () => {
  const [technologies, setTechnologies] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [dataTechnologyEdit, setDataTechnologyEdit] = useState(null);
  const [technologyIdToDelete, setTechnologyIdToDelete] = useState(null);

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

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const showDeleteModal = (record) => {
    if (record.status && record.status.toLowerCase() === 'inactive') {
      setTechnologyIdToDelete(record);
      setIsDeleteModalVisible(true);
    } else {
      message.error('Only inactive technologies can be deleted.');
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setDataTechnologyEdit(null);
    setTimeout(loadTechnologies, 100);
  };

  const handleCloseAddModal = () => {
    setIsAddModalVisible(false);
    setTimeout(loadTechnologies, 100);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setTechnologyIdToDelete(null);
    setTimeout(loadTechnologies, 100);
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
              <Button type="primary" style={{ marginRight: 8 }} onClick={() => showEditModal(record)}>
                Edit
              </Button>
              <Button type="danger" onClick={() => showDeleteModal(record)}>
                Delete
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
      <ModalAddTechnology
        open={isAddModalVisible}
        handleClose={handleCloseAddModal}
      />
      {technologyIdToDelete && (
        <ModalDeleteTechnology
          open={isDeleteModalVisible}
          handleClose={handleCloseDeleteModal}
          dataTechnologyDelete={technologyIdToDelete}
        />
      )}
    </div>
  );
};

export default TechnologyManagement;
