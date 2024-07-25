import React, { useState, useEffect } from 'react';
import { Button, Table, message } from 'antd';
import { fetchAllPositions } from "../service/PositionServices";
import { useNavigate } from "react-router-dom";
import "../assets/style/Pages/PositionManagement.scss";

const { Column } = Table;

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

    const positionAdded = localStorage.getItem('positionAdded');
    if (positionAdded === 'true') {
      message.success("Position added successfully!");
      localStorage.removeItem('positionAdded'); // Xóa thông báo sau khi đã hiển thị
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
  const paginatedData = positions.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={showAddPage}>
        Add New Position
      </Button>
      <Table
        dataSource={paginatedData}
        rowKey="key"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: positions.length,
          onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
        }}
      >
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column title="Department" dataIndex="department" key="department" />
        <Column title="Status" dataIndex="status" key="status" />
        <Column
          title="Actions"
          key="actions"
          render={(text, record) => (
            <span>
            <Button type="primary" onClick={() => navigate(`/position-management/edit/${record.key}`)}>
                Edit
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
