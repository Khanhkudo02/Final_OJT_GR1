import React, { useState, useEffect } from "react";
import { Input, Select, Upload, Button, Layout } from "antd";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { putUpdateTechnology, fetchTechnologyById } from "../service/TechnologyServices";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Header } = Layout;

const EditTechnology = () => {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const loadTechnology = async () => {
      try {
        console.log(`Loading technology with ID: ${id}`);
        const technology = await fetchTechnologyById(id);
        if (technology) {
          console.log("Loaded technology:", technology);
          setName(technology.name || "");
          setDescription(technology.description || "");
          setStatus(technology.status || "");
          // If you want to display the existing image URL, you can handle it here.
        } else {
          toast.error("Technology not found.");
        }
      } catch (error) {
        toast.error("Failed to fetch technology data.");
      }
    };

    loadTechnology();
  }, [id]);

  const handleUpdateTechnology = async () => {
    if (!name || !description || !status) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await putUpdateTechnology(
        id,
        name,
        description,
        status,
        imageFile
      );
      toast.success("Technology updated successfully!");
      navigate("/technology-management");
    } catch (error) {
      toast.error("Failed to update technology.");
      console.error("Error details:", error);
    }
  };

  const handleImageChange = (info) => {
    const file = info.file.originFileObj;
    if (file && (file.type === "image/png" || file.type === "image/svg+xml")) {
      setImageFile(file);
    } else {
      toast.error("Only PNG and SVG images are allowed.");
    }
  };

  const beforeUpload = (file) => {
    handleImageChange({ file });
    return false; // Prevent automatic upload
  };

  return (
    <div>
      <h2>Edit Technology</h2>

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
        onClick={handleUpdateTechnology}
        disabled={!name || !description || !status}
      >
        Save
      </Button>
      <Button
        style={{ marginLeft: 8 }}
        onClick={() => navigate("/technology-management")}
      >
        Back to Technology Management
      </Button>
    </div>
  );
};

export default EditTechnology;
