import React, { useState } from "react";
import { Modal, Button, Input, Upload, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { postCreateTechnology } from "../service/TechnologyServices";
import { toast } from "react-toastify";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig"; // import storage from firebaseConfig.js
import { useNavigate } from 'react-router-dom'; // useNavigate instead of useHistory

const { Option } = Select;

const ModalAddTechnology = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const navigate = useNavigate(); // useNavigate hook

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
            navigate('/technology-management'); // Navigate back to technology management
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
            <Button onClick={() => navigate('/technology-management')} style={{ marginBottom: 16 }}>
                Back
            </Button>
            <Modal
                title="Add New Technology"
                open={true}
                onCancel={() => navigate('/technology-management')}
                footer={[
                    <Button key="back" onClick={() => navigate('/technology-management')}>
                        Close
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleAddTechnology}>
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
                            accept=".png,.svg"
                            beforeUpload={beforeUpload}
                        >
                            <Button icon={<PlusOutlined />}>Select Image (PNG/SVG only)</Button>
                        </Upload>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ModalAddTechnology;
