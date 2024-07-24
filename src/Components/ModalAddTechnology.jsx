import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Modal, Button, Input, Upload, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { postCreateTechnology } from "../service/TechnologyServices";
import { toast } from "react-toastify";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const { Option } = Select;

const ModalAddTechnology = ({ open, handleClose }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(""); // Add state for image URL

    const handleAddTechnology = async () => {
        try {
            setUploading(true);

            // Upload the image and get URL
            if (selectedFile) {
                const fileRef = storageRef(getStorage(), `icons/${selectedFile.name}`);
                await uploadBytes(fileRef, selectedFile);
                const url = await getDownloadURL(fileRef);
                setImageUrl(url); // Store image URL in state
            }

            // Add technology to the database
            await postCreateTechnology(name, description, status, imageUrl);

            // Reset state
            handleClose();
            toast.success("Technology added successfully!");
            setName("");
            setDescription("");
            setStatus("");
            setSelectedFile(null);
            setImagePreview("");
            setImageUrl(""); // Clear image URL
        } catch (error) {
            toast.error("Failed to add technology.");
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
            title="Add New Technology"
            open={open}
            onCancel={() => {
                handleClose();
                setSelectedFile(null);
                setImagePreview("");
            }}
            footer={[
                <Button key="back" onClick={handleClose}>
                    Close
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleAddTechnology}
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

export default ModalAddTechnology;
