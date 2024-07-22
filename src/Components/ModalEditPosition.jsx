import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Select } from "antd";
import { putUpdatePosition } from "/src/service/PositionServices.js"; // Đảm bảo đường dẫn này đúng
import { toast } from "react-toastify";

const { Option } = Select;

const ModalEditPosition = ({ open, handleClose, dataPositionEdit }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [department, setDepartment] = useState("");

    useEffect(() => {
        if (dataPositionEdit) {
            setTitle(dataPositionEdit.title || "");
            setDescription(dataPositionEdit.description || "");
            setDepartment(dataPositionEdit.department || "");
        }
    }, [dataPositionEdit]);

    const handleEditPosition = async () => {
        try {
            await putUpdatePosition(dataPositionEdit.key, title, description, department);
            handleClose();
            toast.success("Position updated successfully!");
        } catch (error) {
            toast.error("Failed to update position.");
        }
    };

    return (
        <Modal
            title="Edit Position"
            open={open}
            onCancel={handleClose}
            footer={[
                <Button key="back" onClick={handleClose}>
                    Close
                </Button>,
                <Button key="submit" type="primary" onClick={handleEditPosition}>
                    Save Changes
                </Button>,
            ]}
        >
            <div className="body-edit">
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

export default ModalEditPosition;
