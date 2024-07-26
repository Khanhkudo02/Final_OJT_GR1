import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Upload, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { putUpdateTechnology } from "../service/TechnologyServices";
import { toast } from "react-toastify";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";

const { Option } = Select;

const ModalEditTechnology = ({ open, handleClose, dataTechnologyEdit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (dataTechnologyEdit) {
      setName(dataTechnologyEdit.name);
      setDescription(dataTechnologyEdit.description);
      setStatus(dataTechnologyEdit.status);
      setImagePreview(dataTechnologyEdit.imageURL); // Cập nhật preview ảnh
    }
  }, [dataTechnologyEdit]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);

      // Tải lên ảnh mới và lấy URL nếu có ảnh mới
      let uploadedImageURL = imagePreview;
      if (image) {
        uploadedImageURL = await handleUpload(); // Tải lên ảnh mới và lấy URL
        toast.success("Image uploaded successfully!");
      }

      // Cập nhật dữ liệu công nghệ với URL ảnh mới
      await putUpdateTechnology(
        dataTechnologyEdit.key,
        name,
        description,
        status,
        uploadedImageURL, // URL mới hoặc cũ nếu không có ảnh mới
        dataTechnologyEdit.imageURL // URL cũ để xóa sau
      );

      toast.success("Technology updated successfully!");

      handleClose();
    } catch (error) {
      toast.error("Failed to update technology.");
      console.error("Error uploading image or updating technology:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      title="Edit Technology"
      open={open}
      onCancel={() => {
        handleClose();
        setImagePreview("");
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
            beforeUpload={(file) => {
              handleImageChange({ target: { files: [file] } });
              return false; // Ngăn tải ảnh tự động
            }}
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
