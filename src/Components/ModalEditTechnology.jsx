import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Upload, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { putUpdateTechnology } from "../service/TechnologyServices";
import { toast } from "react-toastify";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const { Option } = Select;

const ModalEditTechnology = ({ open, handleClose, dataTechnologyEdit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (dataTechnologyEdit) {
      setName(dataTechnologyEdit.name);
      setDescription(dataTechnologyEdit.description);
      setStatus(dataTechnologyEdit.status);
      setImagePreview(dataTechnologyEdit.imageUrl);
    }
  }, [dataTechnologyEdit]);

  const handleImage = async (file) => {
    const storage = getStorage();
    const fileRef = storageRef(storage, `images/${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    const imageUrl = await getDownloadURL(snapshot.ref);
    return imageUrl;
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);

      let imageUrl = imagePreview;
      if (selectedFile) {
        imageUrl = await handleImage(selectedFile);
        toast.success("Image uploaded successfully!");
      }

      await putUpdateTechnology(dataTechnologyEdit.key, name, description, status, imageUrl);

      handleClose();
      toast.success("Technology updated successfully!");
    } catch (error) {
      toast.error("Failed to update technology.");
      console.error("Error uploading image or updating technology:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (info) => {
    if (info.file && info.file.originFileObj) {
      const file = info.file.originFileObj;
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
    return false; // Prevent auto-upload
  };

  return (
    <Modal
      title="Edit Technology"
      open={open}
      onCancel={handleClose}
      footer={[
        <Button key="back" onClick={handleClose}>
          Close
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          disabled={uploading}
        >
          Save
        </Button>,
      ]}
    >
      <div className="body-edit">
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
            accept=".jpg,.jpeg,.png"
            beforeUpload={handleImageChange}
            listType="picture"
          >
            <Button>
              <PlusOutlined />
              Upload Image
            </Button>
          </Upload>
          {imagePreview && (
            <img src={imagePreview} alt="Image Preview" width="100%" />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ModalEditTechnology;
