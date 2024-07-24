import React from "react";
import { Modal, Button } from "antd";
import { deleteEmployee } from "../service/EmployeeServices";
import { toast } from "react-toastify";

const ModalDeleteEmployee = ({ open, handleClose, employee }) => {
    const handleDeleteEmployee = async () => {
        try {
            await deleteEmployee(employee.key); // Use employee.key or employee.id as needed
            handleClose();
            toast.success("Employee deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete employee.");
        }
    };

    return (
        <Modal
            title="Delete Employee"
            open={open}
            onCancel={handleClose}
            footer={[
                <Button key="back" onClick={handleClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" danger onClick={handleDeleteEmployee}>
                    Delete
                </Button>,
            ]}
        >
            <div>
                Are you sure you want to delete this employee?
            </div>
        </Modal>
    );
};

export default ModalDeleteEmployee;