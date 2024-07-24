import React from 'react';
import { Modal, Button, message } from 'antd';
import { deleteTechnology } from '../service/TechnologyServices';

const ModalDeleteTechnology = ({ open, handleClose, dataTechnologyDelete }) => {
    const handleDelete = async () => {
        if (dataTechnologyDelete && dataTechnologyDelete.status.toLowerCase() === 'inactive') {
            try {
                await deleteTechnology(dataTechnologyDelete.key);
                message.success('Technology deleted successfully');
                handleClose();
            } catch (error) {
                message.error('Failed to delete technology');
            }
        } else {
            message.error('Only inactive technologies can be deleted');
        }
    };

    return (
        <Modal
            title="Delete Technology"
            open={open}
            onCancel={handleClose}
            footer={[
                <Button key="back" onClick={handleClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" danger onClick={handleDelete}>
                    Delete
                </Button>,
            ]}
        >
            <p>Are you sure you want to delete this technology?</p>
        </Modal>
    );
};

export default ModalDeleteTechnology;
