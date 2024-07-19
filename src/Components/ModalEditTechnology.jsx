import React, { useState, useEffect } from "react";
import { Modal, Button, Input } from "antd";
import { putUpdateTechnology } from "../service/TechnologyServices";
import { toast } from 'react-toastify';

const ModalEditTechnology = (props) => {
    const { visible, handleClose, dataTechnologyEdit } = props;
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (dataTechnologyEdit) {
            setName(dataTechnologyEdit.title || "");
            setDescription(dataTechnologyEdit.information || "");
            setStatus(dataTechnologyEdit.company || "");
        }
    }, [dataTechnologyEdit]);

    const handleEditTechnology = async () => {
        try {
            let res = await putUpdateTechnology(dataTechnologyEdit.key, name, description, status);
            if (res) {
                handleClose(); // Close modal after success
                toast.success("Technology updated successfully!");
            } else {
                toast.error("Failed to update technology.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        }
    };

    return (
        <Modal
            title="Edit Technology"
            visible={visible}
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
            </div>
        </Modal>
    );
};

export default ModalEditTechnology;
