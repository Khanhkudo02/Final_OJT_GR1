import React, { useState } from "react";
import { Button, Input, Upload, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { postCreateTechnology } from "../service/TechnologyServices";
import { toast } from "react-toastify";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig"; // import storage from firebaseConfig.js

const { Option } = Select;

const AddTechnology = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleAddTechnology = async () => {
    try {
      let imageUrl = "";
      if (imageFile) {
        const storageRef = ref(storage, `technologies/${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }
      await postCreateTechnology(name, description, status, imageUrl);
      toast.success("Technology added successfully!");
      // Clear the form fields and the image file after successfully adding
      setName("");
      setDescription("");
      setStatus("");
      setImageFile(null); // Reset image file
    } catch (error) {
      toast.error("Failed to add technology.");
    }
  };

  const handleImageChange = ({ file }) => {
    if (file.type === "image/png" || file.type === "image/svg+xml") {
      setImageFile(file.originFileObj);
    } else {
      toast.error("Only PNG and SVG images are allowed.");
    }
  };

  const beforeUpload = (file) => {
    handleImageChange({ file });
    return false;
  };

  return (
    <div>
      <h2>Add New Technology</h2>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <Input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <Input
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Status</label>
        <Select
          value={status}
          onChange={(value) => setStatus(value)}
          placeholder="Select Status"
        >
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
      </div>
      <div className="mb-3">
        <Upload
          accept=".png,.svg"
          beforeUpload={beforeUpload}
        >
          <Button icon={<PlusOutlined />}>Select Image (PNG/SVG only)</Button>
        </Upload>
      </div>
      <Button type="primary" onClick={handleAddTechnology}>
        Save
      </Button>
      <Button type="default" onClick={() => history.push("/")}>
        Back
      </Button>
    </div>
  );
};

export default AddTechnology;
