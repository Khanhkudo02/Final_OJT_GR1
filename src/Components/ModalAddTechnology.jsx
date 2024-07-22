import React, { useState } from "react";
import { Modal, Button, Input } from "antd";
import { postCreateTechnology } from "../service/TechnologyServices";
import { toast } from 'react-toastify';

const ModalAddTechnology = ({ visible, handleClose }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");

    const handleAddTechnology = async () => {
        try {
            let res = await postCreateTechnology(name, description, status);
            if (res.status === 201) {
                handleClose(); // Close modal after success
                toast.success("Technology added successfully!");
            } else {
                toast.error("Failed to add technology.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        }
    };

    return (
        <Modal
            title="Add New Technology"
            visible={visible}
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
            </div>
        </Modal>
    );
};

export default ModalAddTechnology;
