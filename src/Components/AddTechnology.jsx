
import React, { useState, useEffect } from "react";
import {
  UploadOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Select, Upload, Table, Modal, Space } from "antd";
import { storage } from "../firebaseConfig";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  postCreateTechnology,
  fetchTechnologyById,
  fetchAllTechnology,
  putUpdateTechnology,
  deleteTechnology,
} from "../service/TechnologyServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Column } = Table;

const AddTechnology = () => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTechnology, setSelectedTechnology] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loadTechnologies = async () => {
    try {
      const data = await fetchAllTechnology();
      setTechnologies(data);
    } catch (error) {
      console.error("Failed to fetch technologies:", error);
    }
  };

  useEffect(() => {
    loadTechnologies();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    if (!imageFile) {
      toast.error("Please upload an image.");
      setLoading(false);
      return;
    }

    try {
      // Upload image to Firebase Storage
      const storageReference = storageRef(
        storage,
        `technologies/${imageFile.name}`
      );
      await uploadBytes(storageReference, imageFile);
      const imageUrl = await getDownloadURL(storageReference);

      // Save technology details to Firebase Database
      const technologyId = await postCreateTechnology(
        values.name,
        values.description,
        values.status,
        imageUrl
      );
      toast.success("Technology added successfully!");
      loadTechnologies(); // Reload the technologies after adding a new one
      navigate("/technology-management");
    } catch (error) {
      toast.error("Failed to add technology.");
      console.error("Error details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTechnology = (technology) => {
    setSelectedTechnology(technology);
    setViewModalVisible(true);
  };

  const handleDeleteTechnology = async (id) => {
    try {
      await deleteTechnology(id);
      toast.success("Technology deleted successfully!");
      loadTechnologies();
    } catch (error) {
      toast.error("Failed to delete technology.");
    }
  };

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      setImageFile(fileList[fileList.length - 1].originFileObj);
    } else {
      setImageFile(null);
    }
  };

  return (
    <div
      style={{
        padding: "24px 0",
        background: "#fff",
        maxWidth: "1000px",
        margin: "auto",
      }}
    >
      <h2>Add New Technology</h2>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please input the technology name!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Please input the technology description!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[
            { required: true, message: "Please select the technology status!" },
          ]}
        >
          <Select>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Image"
          name="image"
          rules={[{ required: true, message: "Please upload an image!" }]}
        >
          <Upload
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleImageChange}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => navigate("/technology-management")}
          >
            Back to Technology Management
          </Button>
        </Form.Item>
      </Form>

      <h2>Existing Technologies</h2>
      <Table dataSource={technologies} rowKey="id" pagination={false}>
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Description" dataIndex="description" key="description" />
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
            <Space>
              <Button
                icon={<UploadOutlined />}
                style={{ color: "green", borderColor: "green" }}
                onClick={() => handleViewTechnology(record)}
              />
              <Button
                icon={<DeleteOutlined />}
                style={{ color: "red", borderColor: "red" }}
                onClick={() => handleDeleteTechnology(record.id)}
              />
            </Space>
          )}
        />
      </Table>

      <Modal
        title="View Technology"
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedTechnology && (
          <div>
            <p>
              <strong>Name:</strong> {selectedTechnology.name}
            </p>
            <p>
              <strong>Description:</strong> {selectedTechnology.description}
            </p>
            <p>
              <strong>Status:</strong> {selectedTechnology.status}
            </p>
            {selectedTechnology.imageUrl && (
              <p>
                <strong>Image:</strong>
                <img
                  src={selectedTechnology.imageUrl}
                  alt="Technology"
                  style={{ width: "100%", height: "auto" }}
                />
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AddTechnology;
