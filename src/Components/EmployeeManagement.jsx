import React, { useState, useEffect } from 'react';
import { Button, Table, message } from 'antd';
import ModalAddEmployee from './ModalAddEmployee';
import ModalEditEmployee from './ModalEditEmployee';
import ModalDeleteEmployee from './ModalDeleteEmployee';
import { fetchAllEmployees } from "../service/EmployeeServices";

const { Column } = Table;

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [dataEmployeeEdit, setDataEmployeeEdit] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const loadEmployees = async () => {
    try {
      const data = await fetchAllEmployees();
      const filteredData = data.filter(employee => !employee.isAdmin); // Filter out admin employees
      setEmployees(filteredData);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const showEditModal = (record) => {
    setDataEmployeeEdit(record);
    setIsEditModalVisible(true);
  };

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const showDeleteModal = (record) => {
    if (record.status && record.status.toLowerCase() === 'inactive') {
      setEmployeeToDelete(record);
      setIsDeleteModalVisible(true);
    } else {
      message.error('Only inactive employees can be deleted.');
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setDataEmployeeEdit(null);
    setTimeout(loadEmployees, 100);
  };

  const handleCloseAddModal = () => {
    setIsAddModalVisible(false);
    setTimeout(loadEmployees, 100);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setEmployeeToDelete(null);
    setTimeout(loadEmployees, 100);
  };

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={showAddModal}>
        Add New Employee
      </Button>
      <Table dataSource={employees} pagination={false}>
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
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Status" dataIndex="status" key="status" />
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
      {dataEmployeeEdit && (
        <ModalEditEmployee
          open={isEditModalVisible}
          handleClose={handleCloseEditModal}
          dataEmployeeEdit={dataEmployeeEdit}
        />
      )}
      <ModalAddEmployee
        open={isAddModalVisible}
        handleClose={handleCloseAddModal}
      />
      {employeeToDelete && (
        <ModalDeleteEmployee
          open={isDeleteModalVisible}
          handleClose={handleCloseDeleteModal}
          employee={employeeToDelete}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;
