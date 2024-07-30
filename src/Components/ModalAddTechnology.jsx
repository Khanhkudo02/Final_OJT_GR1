import React, { useState } from "react";
import { Modal, Button, Input, Upload, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { postCreateTechnology } from "../service/TechnologyServices";
import { toast } from "react-toastify";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";

const { Option } = Select;

const ModalAddTechnology = ({ open, handleClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = ({ fileList }) => {
    setImages(fileList.map(file => file.originFileObj));
    setImagePreviews(fileList.map(file => URL.createObjectURL(file.originFileObj)));
  };

  const handleUpload = async () => {
    const urls = await Promise.all(images.map(async (image) => {
      const imageRef = storageRef(storage, `technology/${Date.now()}_${image.name}`);
      const snapshot = await uploadBytes(imageRef, image);
      return await getDownloadURL(snapshot.ref);
    }));
    return urls;
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);

      let uploadedImageURLs = [];
      if (images.length > 0) {
        uploadedImageURLs = await handleUpload();
        toast.success("Images uploaded successfully!");
      }

      await postCreateTechnology(name, description, status, uploadedImageURLs);

      toast.success("Technology added successfully!");

      // Reset form fields to default values
      setName("");
      setDescription("");
      setStatus("active");
      setImages([]);
      setImagePreviews([]);

      handleClose();
    } catch (error) {
      toast.error("Failed to add technology.");
      console.error("Error adding technology:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      title="Add New Technology"
      open={open}
      onCancel={() => {
        handleClose();
        setImagePreviews([]);
        setStatus("active");
      }}
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
      <div className="body-add">
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
            beforeUpload={() => false}
            multiple
            listType="picture"
            onChange={handleImageChange}
          >
            <Button>
              <PlusOutlined />
              Upload Images
            </Button>
          </Upload>
          {imagePreviews.map((preview, index) => (
            <img key={index} src={preview} alt={`Image Preview ${index}`} width="100%" />
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default ModalAddTechnology;
