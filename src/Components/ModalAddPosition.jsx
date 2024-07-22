import React, { useState } from "react";
import { Modal, Button, Input, Select } from "antd";
import { postCreatePosition } from "/src/service/PositionServices.js"; // Đảm bảo đường dẫn này đúng
import { toast } from "react-toastify";

const { Option } = Select;

const ModalAddPosition = ({ open, handleClose }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [department, setDepartment] = useState("");

    const handleAddPosition = async () => {
        try {
            await postCreatePosition(title, description, department);
            handleClose();
            toast.success("Position added successfully!");
            // Clear the form fields after successfully adding
            setTitle("");
            setDescription("");
            setDepartment("");
        } catch (error) {
            toast.error("Failed to add position.");
        }
    };

    return (
        <Modal
            title="Add New Position"
            open={open}
            onCancel={handleClose}
            footer={[
                <Button key="back" onClick={handleClose}>
                    Close
                </Button>,
                <Button key="submit" type="primary" onClick={handleAddPosition}>
                    Save
                </Button>,
            ]}
        >
            <div className="body-add">
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <Input
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
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
                    <label className="form-label">Department</label>
                    <Select
                        value={department}
                        onChange={(value) => setDepartment(value)}
                        placeholder="Select Department"
                    >
                        <Option value="HR">HR</Option>
                        <Option value="Engineering">Engineering</Option>
                        <Option value="Marketing">Marketing</Option>
                    </Select>
                </div>
            </div>
        </Modal>
    );
};

export default ModalAddPosition;
