import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Select, Upload } from "antd";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { storage } from "../firebaseConfig";
import { putUpdateTechnology } from "../service/TechnologyServices";

const { Option } = Select;

const ModalEditTechnology = ({ open, handleClose, dataTechnologyEdit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [oldImageURLs, setOldImageURLs] = useState([]);

  useEffect(() => {
    if (dataTechnologyEdit) {
      setName(dataTechnologyEdit.name);
      setDescription(dataTechnologyEdit.description);
      setStatus(dataTechnologyEdit.status);
      setOldImageURLs(dataTechnologyEdit.imageURLs || []);
      setImagePreviews(dataTechnologyEdit.imageURLs || []);
    }
  }, [dataTechnologyEdit]);

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

      // Upload new images and get their URLs
      let uploadedImageURLs = [];
      if (images.length > 0) {
        uploadedImageURLs = await handleUpload();
        toast.success("Images uploaded successfully!");
      } else {
        uploadedImageURLs = oldImageURLs; // Keep old images if no new images are uploaded
      }

      await putUpdateTechnology(dataTechnologyEdit.key, name, description, status, uploadedImageURLs, oldImageURLs);

      toast.success("Technology updated successfully!");

      // Reset form fields
      setName("");
      setDescription("");
      setStatus("active");
      setImages([]);
      setImagePreviews([]);
      setOldImageURLs([]);

      handleClose();
    } catch (error) {
      toast.error("Failed to update technology.");
      console.error("Error updating technology:", error);
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
        setName("");
        setDescription("");
        setStatus("active");
        setImages([]);
        setImagePreviews([]);
        setOldImageURLs([]);
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

ModalEditTechnology.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  dataTechnologyEdit: PropTypes.object.isRequired,
};

export default ModalEditTechnology;
