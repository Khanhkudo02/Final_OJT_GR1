import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import { database } from "/src/firebaseConfig"; // Đảm bảo bạn đã tạo và xuất database từ firebaseConfig.js

const { Column } = Table;

const TechnologyManagement = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await database.ref('/your-data-path').once('value');
      const data = snapshot.val();
      const formattedData = Object.keys(data).map(key => ({
        key: key,
        ...data[key]
      }));
      setData(formattedData);
    };

    fetchData();
  }, []);

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }}>
        Add New Row
      </Button>
      
      <Table dataSource={data} pagination={false}>
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
              <Button type="primary" style={{ marginRight: 8 }}>
                Edit
              </Button>
              <Button type="danger">Delete</Button>
            </span>
          )}
        />
      </Table>
    </div>
  );
};

export default TechnologyManagement;
