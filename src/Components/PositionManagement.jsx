import React, { useState, useEffect } from "react";
import { Button, Table, message, Modal } from "antd";
import {
  fetchAllPositions,
  deletePositionById,
} from "../service/PositionServices";
import { useNavigate } from "react-router-dom";
import "../assets/style/Pages/PositionManagement.scss";
import "../assets/style/Global.scss";

const { Column } = Table;
const { confirm } = Modal;

const PositionManagement = () => {
  const [positions, setPositions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [dataPositionEdit, setDataPositionEdit] = useState(null);

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

    const positionAdded = localStorage.getItem("positionAdded");
    if (positionAdded === "true") {
      message.success("Position added successfully!");
      localStorage.removeItem("positionAdded"); // Xóa thông báo sau khi đã hiển thị
    }
  }, []);
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

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
        className="btn"
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={showAddPage}
      >
        Add New Position
      </Button>
      <Table
        dataSource={paginatedData}
        rowKey="key"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: positions.length,
          onChange: (page, pageSize) =>
            handleTableChange({ current: page, pageSize }),
        }}
      >
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column title="Department" dataIndex="department" key="department" />
        <Column
          title="Status"
          dataIndex="status"
          key="status"
          render={(text) => {
            const className =
              text === "active" ? "status-active" : "status-inactive";
            return (
              <span className={className}>
                {text ? text.charAt(0).toUpperCase() + text.slice(1) : ""}
              </span>
            );
          }}
        />
        <Column
          title="Actions"
          key="actions"
          render={(text, record) => (
            <span>
              <Button
                className="detail-button"
                type="primary"
                onClick={() =>
                  navigate(`/position-management/view/${record.key}`)
                }
              >
                Detail
              </Button>
              <Button
                className="edit-button"
                type="primary"
                onClick={() =>
                  navigate(`/position-management/edit/${record.key}`)
                }
                style={{ marginLeft: 8 }}
              >
                Edit
              </Button>
              <Button
                className="delete-button"
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
          handleClose={() => setIsEditModalVisible(false)}
          dataPositionEdit={dataPositionEdit}
        />
      )}
    </div>
  );
};

export default PositionManagement;
