import React, { useState, useEffect } from 'react';
import { Button, Table } from 'antd';
import ModalAddPosition from './ModalAddPosition';
import ModalEditPosition from './ModalEditPosition';
import ModalDeletePosition from './ModalDeletePosition';
import { fetchAllPositions, postCreatePosition, putUpdatePosition, deletePosition } from "../service/PositionServices";

const { Column } = Table;

const PositionManagement = () => {
  const [positions, setPositions] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [dataPositionEdit, setDataPositionEdit] = useState(null);
  const [positionIdToDelete, setPositionIdToDelete] = useState(null);

  const loadPositions = async () => {
    try {
      const data = await fetchAllPositions();
      setPositions(data);
    } catch (error) {
      console.error("Failed to fetch positions:", error);
    }
  };

  useEffect(() => {
    loadPositions();
  }, []);

  const showEditModal = (record) => {
    setDataPositionEdit(record);
    setIsEditModalVisible(true);
  };

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const showDeleteModal = (id) => {
    setPositionIdToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setDataPositionEdit(null);
    setTimeout(() => loadPositions(), 100);
  };

  const handleCloseAddModal = () => {
    setIsAddModalVisible(false);
    setTimeout(() => loadPositions(), 100);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setPositionIdToDelete(null);
    setTimeout(() => loadPositions(), 100);
  };

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={showAddModal}>
        Add New Position
      </Button>
      <Table dataSource={positions} pagination={false}>
        <Column title="Title" dataIndex="title" key="title" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column title="Department" dataIndex="department" key="department" />
        <Column
          title="Actions"
          key="actions"
          render={(text, record) => (
            <span>
              <Button type="primary" style={{ marginRight: 8 }} onClick={() => showEditModal(record)}>
                Edit
              </Button>
              <Button type="danger" onClick={() => showDeleteModal(record.key)}>
                Delete
              </Button>
            </span>
          )}
        />
      </Table>
      {dataPositionEdit && (
        <ModalEditPosition
          open={isEditModalVisible}
          handleClose={handleCloseEditModal}
          dataPositionEdit={dataPositionEdit}
        />
      )}
      <ModalAddPosition
        open={isAddModalVisible}
        handleClose={handleCloseAddModal}
      />
      {positionIdToDelete && (
        <ModalDeletePosition
          open={isDeleteModalVisible}
          handleClose={handleCloseDeleteModal}
          positionId={positionIdToDelete}
        />
      )}
    </div>
  );
};

export default PositionManagement;
