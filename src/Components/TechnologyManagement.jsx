import React from 'react';
import { Button, Table } from 'antd';

const { Column } = Table;

const data = [
  { key: '1', title: 'Car', information: 'One of the best Car.', price: 10, company: 'Toyota', image: '/images/kaffka.jpg' },
  { key: '2', title: 'Bike', information: 'Good Bike.', price: 20, company: 'Honda' },
  { key: '3', title: 'Book', information: 'Nice book to read', price: 50, company: 'Book Angencies' },
  { key: '4', title: 'Cycles', information: 'Best for health.', price: 60, company: 'Frog' },
  { key: '5', title: 'TV', information: 'Nice clearity', price: 50, company: 'LG' },
  { key: '6', title: 'Computer', information: 'Help to do programs.', price: 60, company: 'Honda' },
  { key: '7', title: 'Laptop', information: 'Good to do multi-tasking', price: 50, company: 'Lenovo' }
];

const TechnologyManagement = () => {
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
              <img src={record.image} alt={record.title} style={{ width: 50, height: 50 }} />
            )}/>
        <Column title="Title" dataIndex="title" key="title" />
        <Column title="Information" dataIndex="information" key="information" />
        <Column title="Price" dataIndex="price" key="price" />
        <Column title="Company" dataIndex="company" key="company" />
        <Column
          title="Actions"
          key="actions"
          render={(text, record) => (
            <span>
              <Button type="primary" style={{ marginRight: 8 }}>Edit</Button>
              <Button type="danger">Delete</Button>
            </span>
          )}
        />
      </Table>
    </div>
  );
};

export default TechnologyManagement;
