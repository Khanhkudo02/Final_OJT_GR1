import React from "react";
import PropTypes from 'prop-types';
import { Modal, Button } from "antd";
import { deletePosition } from "/src/service/PositionServices.js"; // Đảm bảo đường dẫn này đúng
import { toast } from "react-toastify";

const ModalDeletePosition = ({ open, handleClose, positionId }) => {
    const handleDeletePosition = async () => {
        try {
            await deletePosition(positionId);
            handleClose();
            toast.success("Position deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete position.");
        }
    };

    return (
        <Modal
            title="Delete Position"
            open={open}
            onCancel={handleClose}
            footer={[
                <Button key="back" onClick={handleClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" danger onClick={handleDeletePosition}>
                    Delete
                </Button>,
            ]}
        >
            <p>Are you sure you want to delete this position?</p>
        </Modal>
    );
};

ModalDeletePosition.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    positionId: PropTypes.shape({
        key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    }).isRequired
};


export default ModalDeletePosition;
