import React, { useState, useEffect } from 'react';
import { Button, Table } from 'antd';
import ModalAddTechnology from './ModalAddTechnology';
import ModalEditTechnology from './ModalEditTechnology';
import { fetchAllTechnology } from "../service/TechnologyServices";

const { Column } = Table;

const TechnologyManagement = () => {
  const [technologies, setTechnologies] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [dataTechnologyEdit, setDataTechnologyEdit] = useState(null);

  useEffect(() => {
    const loadTechnologies = async () => {
      try {
        const data = await fetchAllTechnology();
        setTechnologies(data);
      } catch (error) {
        console.error("Failed to fetch technologies:", error);
      }
    };
    loadTechnologies();
  }, []);

  const showEditModal = (record) => {
    setDataTechnologyEdit(record);
    setIsEditModalVisible(true);
  };

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setDataTechnologyEdit(null);
  };

  const handleCloseAddModal = () => {
    setIsAddModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={showAddModal}>
        Add New Technology
      </Button>
      <Table dataSource={technologies} pagination={false}>
        <Column
          title="Image"
          dataIndex="image"
          key="image"
          render={(text, record) => (
            <img
              src={record.image}
              alt={record.title}
              style={{ width: 50, height: 50 }}
            />
          )}
        />
        <Column title="Title" dataIndex="title" key="title" />
        <Column title="Information" dataIndex="information" key="information" />
        <Column title="Price" dataIndex="price" key="price" />
        <Column title="Company" dataIndex="company" key="company" />
        <Column
          title="Actions"
          key="actions"
          render={(text, record) => (
            <span>
              <Button type="primary" style={{ marginRight: 8 }} onClick={() => showEditModal(record)}>
                Edit
              </Button>
              <Button type="danger">Delete</Button>
            </span>
          )}
        />
      </Table>
      {dataTechnologyEdit && (
        <ModalEditTechnology
          visible={isEditModalVisible}
          handleClose={handleCloseEditModal}
          dataTechnologyEdit={dataTechnologyEdit}
        />
      )}
      <ModalAddTechnology
        visible={isAddModalVisible}
        handleClose={handleCloseAddModal}
      />
    </div>
  );
};

export default TechnologyManagement;
