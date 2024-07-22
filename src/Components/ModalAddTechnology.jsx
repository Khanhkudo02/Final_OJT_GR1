import React, { useState } from "react";
import { Modal, Button, Input, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { postCreateTechnology } from "../service/TechnologyServices";
import { toast } from "react-toastify";

const ModalAddTechnology = ({ open, handleClose }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const handleAddTechnology = async () => {
        try {
            await postCreateTechnology(name, description, status, imageFile);
            handleClose();
            toast.success("Technology added successfully!");
        } catch (error) {
            toast.error("Failed to add technology.");
        }
    };

    const handleImageChange = (info) => {
        if (info.file.status === "done") {
            if (info.file.type === "image/png" || info.file.type === "image/svg+xml") {
                setImageFile(info.file.originFileObj);
            } else {
                toast.error("Only PNG and SVG images are allowed.");
                setImageFile(null);
            }
        }
    };

    return (
        <Modal
            title="Add New Technology"
            open={open}
            onCancel={handleClose}
            footer={[
                <Button key="back" onClick={handleClose}>
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
                    <Input
                        type="text"
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <Upload
                        accept=".png,.svg"
                        beforeUpload={() => false} // Prevent automatic upload
                        onChange={handleImageChange}
                    >
                        <Button icon={<PlusOutlined />}>Select Image (PNG/SVG only)</Button>
                    </Upload>
                </div>
            </div>
        </Modal>
    );
};

export default ModalAddTechnology;
