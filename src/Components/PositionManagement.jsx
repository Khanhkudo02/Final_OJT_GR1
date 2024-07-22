import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import { database } from "/src/firebaseConfig"; // Đảm bảo bạn đã tạo và xuất database từ firebaseConfig.js

const { Column } = Table;

const PositionManagement = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await database.ref('/positions').once('value');
      const data = snapshot.val();
      const formattedData = Object.keys(data).map(key => ({
        key: key,
        ...data[key]
      }));
      setData(formattedData);
    };

    fetchData();
  }, []);

  const addItem = () => {
    const newItem = {
      title: "New Position",
      description: "Description of new position",
      department: "New Department",
      salary: 1000,
    };

    database.ref('/positions').push(newItem).then(() => {
      fetchData(); // Cập nhật lại dữ liệu sau khi thêm
    });
  };

  const deleteItem = (key) => {
    database.ref(`/positions/${key}`).remove().then(() => {
      fetchData(); // Cập nhật lại dữ liệu sau khi xóa
    });
  };

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={addItem}>
        Add New Position
      </Button>
      <Table dataSource={data} pagination={false}>
        <Column title="Title" dataIndex="title" key="title" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column title="Department" dataIndex="department" key="department" />
        <Column title="Salary" dataIndex="salary" key="salary" />
        <Column
          title="Actions"
          key="actions"
          render={(text, record) => (
            <span>
              <Button type="primary" style={{ marginRight: 8 }}>
                Edit
              </Button>
              <Button type="danger" onClick={() => deleteItem(record.key)}>Delete</Button>
            </span>
          )}
        />
      </Table>
    </div>
  );
};

export default PositionManagement;