import React, { useState, useEffect } from "react";
import { Button, Input, Select, Table, Modal, Space, Upload } from "antd";
import {
  postCreatePosition,
  fetchAllPositions,
  deletePositionById,
} from "../service/PositionServices";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../assets/style/Global.scss";
import { storage } from "/Users/mac/Documents/Final_OJT_GR1/src/firebaseConfig.js";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const { Option } = Select;
const { Column } = Table;

const AddPosition = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("active");
  const [positions, setPositions] = useState([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();

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
  }, []);

  const handleAddPosition = async () => {
    if (!name || !description || !department || !status) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const positionData = {
        name,
        description,
        department,
        status,
        imageURL,
      };
      await postCreatePosition(positionData);
      localStorage.setItem("positionAdded", "true");
      navigate("/position-management");
    } catch (error) {
      toast.error("Failed to add position.");
    }
  };

  const handleViewPosition = (position) => {
    setSelectedPosition(position);
    setViewModalVisible(true);
  };

  const handleDeletePosition = async (id) => {
    try {
      await deletePositionById(id);
      toast.success("Position deleted successfully!");
      loadPositions(); // Reload the positions list
    } catch (error) {
      toast.error("Failed to delete position.");
    }
  };

  const handleImageChange = (info) => {
    if (info.file && info.file.originFileObj) {
      setImage(info.file.originFileObj);
      setImagePreview(URL.createObjectURL(info.file.originFileObj));
    }
  };

  const handleUpload = () => {
    if (image) {
      const storageReference = storageRef(storage, `images/${image.name}`);
      uploadBytes(storageReference, image)
        .then((snapshot) => getDownloadURL(snapshot.ref))
        .then((url) => {
          setImageURL(url);
        })
        .catch((error) => {
          console.error("Upload failed:", error);
          toast.error("Failed to upload image.");
        });
    }
  };

  return (
    <div className="add-position">
      <h2>Add New Position</h2>
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
        <label>Department</label>
        <Input
          type="text"
          value={department}
          onChange={(event) => setDepartment(event.target.value)}
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
        <label>Upload Image</label>
        <Upload
          accept=".jpg,.jpeg,.png"
          beforeUpload={(file) => {
            handleImageChange({ file });
            return false; // Prevent automatic upload
          }}
          listType="picture"
        >
          <Button icon={<PlusOutlined />}>Upload Image</Button>
        </Upload>
        {imagePreview && <img src={imagePreview} alt="Image Preview" width="100%" />}
        <Button
          type="primary"
          onClick={handleUpload}
          disabled={!image}
          style={{ marginTop: 16 }}
        >
          Upload
        </Button>
      </div>
      <Button
        type="primary"
        onClick={handleAddPosition}
        disabled={!name || !description || !department || !status}
      >
        Save
      </Button>
      <Button
        style={{ marginLeft: 8 }}
        onClick={() => navigate("/position-management")}
      >
        Back to Position Management
      </Button>

      <h2>Existing Positions</h2>
      <Table dataSource={positions} rowKey="key" pagination={false}>
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
            <Space>
              <Button 
                icon={<EyeOutlined />} 
                style={{ color: "green", borderColor: "green" }} 
                onClick={() => handleViewPosition(record)}
              />
              <Button 
                icon={<DeleteOutlined />} 
                style={{ color: "red", borderColor: "red" }} 
                onClick={() => handleDeletePosition(record.key)}
              />
            </Space>
          )}
        />
      </Table>
      <Modal
        title="View Position"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedPosition && (
          <div>
            <p>
              <strong>Name:</strong> {selectedPosition.name}
            </p>
            <p>
              <strong>Description:</strong> {selectedPosition.description}
            </p>
            <p>
              <strong>Department:</strong> {selectedPosition.department}
            </p>
            <p>
              <strong>Status:</strong> {selectedPosition.status}
            </p>
            {selectedPosition.imageURL && (
              <img src={selectedPosition.imageURL} alt="Position Image" width="100%" />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AddPosition;
