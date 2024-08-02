import React, { useState, useEffect } from "react";
import { Button, Input, Select, Table, Modal, Space, Upload } from "antd";
import { v4 as uuidv4 } from 'uuid';
import { storage, database } from "../firebaseConfig"; // Import Firebase config
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as databaseRef, set } from "firebase/database";
import {
  postCreateTechnology,
  fetchAllTechnology,
  deleteTechnology,
} from "../service/TechnologyServices";
import { EyeOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../assets/style/Global.scss";

const { Option } = Select;
const { Column } = Table;

const AddTechnology = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [imageFile, setImageFile] = useState(null);
  const [technologies, setTechnologies] = useState([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTechnology, setSelectedTechnology] = useState(null);

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

  const handleAddTechnology = async () => {
    if (!name || !description || !status || !imageFile) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const technologyId = uuidv4();

      // Upload image to Firebase Storage
      const storageReference = storageRef(storage, `technologies/${technologyId}/${imageFile.name}`);
      await uploadBytes(storageReference, imageFile);
      const imageUrl = await getDownloadURL(storageReference);

      // Save technology details to Firebase Database
      await postCreateTechnology(technologyId, name, description, status, imageUrl);
      localStorage.setItem("technologyAdded", "true");
      toast.success("Technology added successfully!");
      navigate("/technology-management");
    } catch (error) {
      toast.error("Failed to add technology.");
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

  const handleImageChange = (info) => {
    const file = info.file.originFileObj;
    if (file && (file.type === "image/png" || file.type === "image/svg+xml")) {
      setImageFile(file);
    } else {
      toast.error("Only PNG and SVG images are allowed.");}
  };

  const beforeUpload = (file) => {
    handleImageChange({ file });
    return false; // Prevent automatic upload
  };

  return (
    <div className="add-technology">
      <h2>Add New Technology</h2>
      <div className="form-group">
        <label>Name</label>
        <Input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <Input
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Status</label>
        <Select
          value={status}
          onChange={(value) => setStatus(value)}
          placeholder="Select Status"
        >
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
      </div>
      <div className="form-group">
        <label>Image</label>
        <Upload
          beforeUpload={beforeUpload}
          showUploadList={false}
          customRequest={() => {}}
        >
          <Button icon={<PlusOutlined />}>Upload Image</Button>
        </Upload>
      </div>
      <Button
        type="primary"
        onClick={handleAddTechnology}
        disabled={!name || !description || !status || !imageFile}
      >
        Save
      </Button>
      <Button
        style={{ marginLeft: 8 }}
        onClick={() => navigate("/technology-management")}
      >
        Back to Technology Management
      </Button>

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
                icon={<EyeOutlined />}
                style={{ color: "green", borderColor: "green" }}
                onClick={() => handleViewTechnology(record)}
              />
              <Button
                icon={<DeleteOutlined />}
                style={{ color: "red", borderColor: "red" }}
                onClick={() => handleDeleteTechnology(record.key)}
              />
            </Space>
          )}
        />
      </Table>
      <Modal
        title="View Technology"
        open={viewModalVisible}onCancel={() => setViewModalVisible(false)}
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
                <img src={selectedTechnology.imageUrl} alt="Technology" style={{ width: "100%", height: "auto" }} />
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AddTechnology;