import React, { useState, useEffect } from "react";
import { Input, Select, Upload, Button, Layout } from "antd"; // Changed import here
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import {
  putUpdatePosition,
  fetchPositionById,
} from "../service/PositionServices";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Header } = Layout;

const EditPosition = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const loadPosition = async () => {
      try {
        console.log(`Loading position with ID: ${id}`);
        const position = await fetchPositionById(id);
        if (position) {
          console.log("Loaded position:", position);
          setName(position.name || "");
          setDescription(position.description || "");
          setDepartment(position.department || "");
          setStatus(position.status || "");
        } else {
          toast.error("Position not found.");
        }
      } catch (error) {
        toast.error("Failed to fetch position data.");
      }
    };

    loadPosition();
  }, [id]);

  const handleUpdatePosition = async () => {
    if (!name || !description || !department || !status) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await putUpdatePosition(
        id,
        name,
        description,
        department,
        status,
      );
      toast.success("Position updated successfully!");
      navigate("/position-management");
    } catch (error) {
      toast.error("Failed to update position.");
      console.error("Error details:", error);
    }
  };

  
  const beforeUpload = (file) => {
    handleImageChange({ file });
    return false;
  };

  return (
    <div>
      <h2>Edit Position</h2>

      <div className="form-group">
        <label>Name</label>
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <Input.TextArea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Department</label>
        <Input
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Status</label>
        <Select
          placeholder="Select Status"
          value={status}
          onChange={(value) => setStatus(value)}
        >
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
      </div>
      <Button
        type="primary"
        onClick={handleUpdatePosition}
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
    </div>
  );
};

export default EditPosition;