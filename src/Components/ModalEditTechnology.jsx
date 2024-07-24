import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Upload, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { putUpdateTechnology } from "../service/TechnologyServices";
import { toast } from "react-toastify";
import { storage } from "../firebaseConfig";

const { Option } = Select;

const ModalEditTechnology = ({ open, handleClose, dataTechnologyEdit }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        if (dataTechnologyEdit) {
            setName(dataTechnologyEdit.name || "");
            setDescription(dataTechnologyEdit.description || "");
            setStatus(dataTechnologyEdit.status || "");
            setImagePreview(dataTechnologyEdit.imageUrl || "");
        }
    }, [dataTechnologyEdit]);

    const handleEditTechnology = async () => {
        try {
            if (selectedFile) {
                const uploadTask = storage.ref(`images/${selectedFile.name}`).put(selectedFile);
                uploadTask.on(
                    "state_changed",
                    snapshot => { },
                    error => {
                        console.log(error);
                        toast.error("Failed to upload image.");
                    },
                    () => {
                        storage
                            .ref("images")
                            .child(selectedFile.name)
                            .getDownloadURL()
                            .then(async (url) => {
                                setImageUrl(url);
                                const res = await putUpdateTechnology(
                                    dataTechnologyEdit.key,
                                    name,
                                    description,
                                    status,
                                    url
                                );
                                if (res) {
                                    handleClose();
                                    toast.success("Technology updated successfully!");
                                } else {
                                    toast.error("Failed to update technology.");
                                }
                            });
                    }
                );
            } else {
                const res = await putUpdateTechnology(
                    dataTechnologyEdit.key,
                    name,
                    description,
                    status,
                    imagePreview
                );
                if (res) {
                    handleClose();
                    toast.success("Technology updated successfully!");
                } else {
                    toast.error("Failed to update technology.");
                }
            }
        } catch (error) {
            toast.error("An error occurred.");
        }
    };

    const handleImageChange = (info) => {
        const file = info.file.originFileObj;
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const beforeUpload = (file) => {
        handleImageChange({ file });
        return false;
    };

    return (
        <Modal
            title="Edit Technology"
            open={open}
            onCancel={() => {
                handleClose();
                setSelectedFile(null);
                setImagePreview("");
                setImageUrl("");
            }}
            footer={[
                <Button key="back" onClick={handleClose}>
                    Close
                </Button>,
                <Button key="submit" type="primary" onClick={handleEditTechnology}>
                    Save Changes
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
                        accept="image/*"
                        beforeUpload={beforeUpload}
                        showUploadList={false}
                    >
                        <Button icon={<PlusOutlined />}>Select Image</Button>
                    </Upload>
                    {imagePreview && (
                        <div style={{ marginTop: 10 }}>
                            <img src={imagePreview} alt="preview" style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }} />
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ModalEditTechnology;
