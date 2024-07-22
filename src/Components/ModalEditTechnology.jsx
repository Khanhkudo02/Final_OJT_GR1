import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { putUpdateTechnology } from "../service/TechnologyServices";
import { toast } from "react-toastify";

const ModalEditTechnology = ({ open, handleClose, dataTechnologyEdit }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (dataTechnologyEdit) {
            setName(dataTechnologyEdit.name || "");
            setDescription(dataTechnologyEdit.description || "");
            setStatus(dataTechnologyEdit.status || "");
        }
    }, [dataTechnologyEdit]);

    const handleEditTechnology = async () => {
        try {
            const res = await putUpdateTechnology(
                dataTechnologyEdit.key,
                name,
                description,
                status,
                imageFile
            );
            if (res) {
                handleClose();
                toast.success("Technology updated successfully!");
            } else {
                toast.error("Failed to update technology.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        }
    };

    const handleImageChange = ({ file }) => {
        if (file.type === "image/png" || file.type === "image/svg+xml") {
            setImageFile(file.originFileObj);
        } else {
            toast.error("Only PNG and SVG images are allowed.");
        }
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

export default ModalEditTechnology;
