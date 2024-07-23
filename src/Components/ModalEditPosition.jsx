import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Select, Upload } from "antd";
import { toast } from "react-toastify";
import { putUpdatePosition } from "../service/PositionServices";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const ModalEditPosition = ({ open, handleClose, dataPositionEdit }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");
    const [imageFile, setImageFile] = useState(null); // New state for the image file

    useEffect(() => {
        if (dataPositionEdit) {
            setName(dataPositionEdit.name);
            setDescription(dataPositionEdit.description);
            setDepartment(dataPositionEdit.department);
            setStatus(dataPositionEdit.status);
            setImageFile(null); // Reset image file when modal is opened
        }
    }, [dataPositionEdit]);

    const handleUpdatePosition = async () => {
        try {
            await putUpdatePosition(
                dataPositionEdit.key,
                name,
                description,
                department,
                status,
                imageFile
            );
            handleClose();
            toast.success("Position updated successfully!");
        } catch (error) {
            toast.error("Failed to update position.");
        }
    };

    const handleImageChange = ({ file }) => {
        if (file.type === "image/png" || file.type === "image/svg+xml") {
            setImageFile(file.originFileObj); // Store the selected image file
        } else {
            toast.error("Only PNG and SVG images are allowed.");
        }
    };

    const beforeUpload = (file) => {
        handleImageChange({ file });
        return false; // Prevent automatic upload
    };

    return (
        <Modal
            title="Edit Position"
            open={open}
            onCancel={() => {
                handleClose();
                setImageFile(null); // Reset image file when modal is closed
            }}
            footer={[
                <Button key="back" onClick={handleClose}>
                    Close
                </Button>,
                <Button key="submit" type="primary" onClick={handleUpdatePosition}>
                    Save
                </Button>,
            ]}
        >
            <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginBottom: "1rem" }}
            />
            <Input.TextArea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ marginBottom: "1rem" }}
            />
            <Input
                placeholder="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{ marginBottom: "1rem" }}
            />
            <Select
                placeholder="Status"
                value={status}
                onChange={(value) => setStatus(value)}
                style={{ marginBottom: "1rem", width: "100%" }}
            >
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
            </Select>
            <Upload
                name="logo"
                listType="picture"
                showUploadList={false}
                beforeUpload={beforeUpload}
            >
                <Button icon={<PlusOutlined />}>Upload Image (PNG or SVG only)</Button>
            </Upload>
        </Modal>
    );
};

export default ModalEditPosition;
