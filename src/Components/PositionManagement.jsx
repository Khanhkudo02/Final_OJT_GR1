import React, { useState, useEffect } from "react";
import { Button, Table, message, Modal } from "antd";
import {
  fetchAllPositions,
  deletePositionById,
} from "../service/PositionServices";
import { useNavigate } from "react-router-dom";
import "../assets/style/Pages/PositionManagement.scss";

const { Column } = Table;
const { confirm } = Modal;

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
      console.log(data); // Debugging: Check the data structure
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

  const showAddPage = () => {
    navigate("/positions/add");
  };
  const handleDelete = (record) => {
    if (record.status !== "inactive") {
      message.error("Only inactive positions can be deleted.");
      return;
    }

    confirm({
      title: "Are you sure you want to delete this position?",
      onOk: async () => {
        try {
          await deletePositionById(record.key);
          message.success("Position deleted successfully!");
          loadPositions();
        } catch (error) {
          message.error("Failed to delete position.");
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const paginatedData = positions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={showAddModal}
      >
        Add New Position
      </Button>
      <Table dataSource={positions} rowKey="key" pagination={false}>
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column title="Department" dataIndex="department" key="department" />
        <Column title="Status" dataIndex="status" key="status" />
        <Column
          title="Actions"
          key="actions"
          render={(text, record) => (
            <span>
              <Button
                type="primary"
                onClick={() =>
                  navigate(`/position-management/view/${record.key}`)
                }
              >
                Detail
              </Button>
              <Button
                type="danger"
                onClick={() => handleDelete(record)}
                style={{ marginLeft: 8 }}
              >
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
