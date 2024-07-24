import React, { useEffect, useState } from "react";
import { Button, Table, Input, Select, Modal, Form, Drawer, Avatar, Col, Divider, Row } from "antd";
import { database } from "../firebaseConfig"; // Ensure you have created and exported the database from firebaseConfig.js
import { utils, writeFile } from 'xlsx';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';

const { Column } = Table;
const { Option } = Select;

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

const EmployeeManagement = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState({ name: '', position: '', status: '' });
  const [visible, setVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const snapshot = await database.ref('/employees').once('value');
    const data = snapshot.val();
    const formattedData = Object.keys(data).map(key => ({
      key: key,
      ...data[key]
    }));
    setData(formattedData);
  };

  const handleFilterChange = (field, value) => {
    setFilter({ ...filter, [field]: value });
  };

  const filteredData = data.filter(employee => {
    return (
      (filter.name ? employee.name.includes(filter.name) : true) &&
      (filter.position ? employee.position.includes(filter.position) : true) &&
      (filter.status ? employee.status.includes(filter.status) : true)
    );
  });

  const addItem = () => {
    form.validateFields().then(values => {
      database.ref('/employees').push(values).then(() => {
        fetchData();
        form.resetFields();
        setVisible(false);
      });
    });
  };

  const editItem = (key) => {
    form.validateFields().then(values => {
      database.ref(`/employees/${key}`).update(values).then(() => {
        fetchData();
        setVisible(false);
      });
    });
  };

  const deleteItem = (key) => {
    database.ref(`/employees/${key}`).remove().then(() => {
      fetchData();
    });
  };

  const openEditModal = (employee) => {
    setCurrentEmployee(employee);
    form.setFieldsValue(employee);
    setVisible(true);
  };

  const closeModal = () => {
    form.resetFields();
    setVisible(false);
    setCurrentEmployee(null);
  };

  const handleExportToExcel = () => {
    const worksheet = utils.json_to_sheet(filteredData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Employees");
    writeFile(workbook, "EmployeeList.xlsx");
  };

  const handleExportToWord = (employee) => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun(`ID: ${employee.id}`),
                new TextRun(`Name: ${employee.name}`),
                new TextRun(`Position: ${employee.position}`),
                new TextRun(`Status: ${employee.status}`),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${employee.name}_CV.docx`);
    });
  };

  const showDrawer = (employee) => {
    setCurrentEmployee(employee);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setCurrentEmployee(null);
  };

  return (
    <main>
      <div>
        <h2>Employee Management</h2>
      </div>
      <section className="employee-profile">
        <Input
          placeholder="Search by name"
          value={filter.name}
          onChange={(e) => handleFilterChange('name', e.target.value)}
          style={{ width: 200, marginRight: 10 }}
        />
        <Select
          placeholder="Filter by position"
          value={filter.position}
          onChange={(value) => handleFilterChange('position', value)}
          style={{ width: 200, marginRight: 10 }}
        >
          <Option value="">All Positions</Option>
          {/* Add options based on your data */}
        </Select>
        <Select
          placeholder="Filter by status"
          value={filter.status}
          onChange={(value) => handleFilterChange('status', value)}
          style={{ width: 200 }}
        >
          <Option value="">All Statuses</Option>
          <Option value="Available">Available</Option>
          <Option value="Inactive">Inactive</Option>
          <Option value="Assigned">Assigned</Option>
        </Select>
        <Button type="primary" style={{ margin: '0 10px' }} onClick={() => setVisible(true)}>
          Add New Employee
        </Button>
        <Button onClick={handleExportToExcel} style={{ marginLeft: 10 }}>
          Export to Excel
        </Button>
        <Table dataSource={filteredData} pagination={false}>
          <Column title="ID" dataIndex="id" key="id" />
          <Column title="Name" dataIndex="name" key="name" />
          <Column title="Position" dataIndex="position" key="position" />
          <Column title="Status" dataIndex="status" key="status" />
          <Column
            title="Actions"
            key="actions"
            render={(text, record) => (
              <span>
                <Button type="primary" style={{ marginRight: 8 }} onClick={() => openEditModal(record)}>
                  Edit
                </Button>
                <Button type="danger" onClick={() => deleteItem(record.key)}>Delete</Button>
                <Button onClick={() => handleExportToWord(record)} style={{ marginLeft: 10 }}>
                  Export CV
                </Button>
                <Button onClick={() => showDrawer(record)} style={{ marginLeft: 10 }}>
                  View Profile
                </Button>
              </span>
            )}
          />
        </Table>
        <Modal
          title={currentEmployee ? "Edit Employee" : "Add Employee"}
          visible={visible}
          onCancel={closeModal}
          onOk={currentEmployee ? () => editItem(currentEmployee.key) : addItem}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="position" label="Position" rules={[{ required: true, message: 'Please input the position!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select the status!' }]}>
              <Select>
                <Option value="Available">Available</Option>
                <Option value="Inactive">Inactive</Option>
                <Option value="Assigned">Assigned</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        <Drawer
          width={640}
          placement="right"
          closable={false}
          onClose={closeDrawer}
          open={drawerVisible}
        >
          {currentEmployee && (
            <>
              <p className="site-description-item-profile-p" style={{ marginBottom: 24 }}>
                Employee Profile
              </p>
              <Row>
                <Col span={12}>
                  <DescriptionItem title="Full Name" content={currentEmployee.name} />
                </Col>
                <Col span={12}>
                  <DescriptionItem title="Position" content={currentEmployee.position} />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem title="Status" content={currentEmployee.status} />
                </Col>
              </Row>
              {/* Add more fields as necessary */}
              <Divider />
              <p className="site-description-item-profile-p">Contact</p>
              <Row>
                <Col span={12}>
                  <DescriptionItem title="Email" content="example@example.com" />
                </Col>
                <Col span={12}>
                  <DescriptionItem title="Phone Number" content="+123 456 789" />
                </Col>
              </Row>
            </>
          )}
        </Drawer>
      </section>
    </main>
  );
};

export default EmployeeManagement;
