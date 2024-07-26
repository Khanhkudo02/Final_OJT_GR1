import React from 'react';
import { Button, Modal, message } from 'antd';
import { deleteTechnology } from '../service/TechnologyServices';
import { useNavigate } from 'react-router-dom';

const { confirm } = Modal;

const ModalDeleteTechnology = ({ open, handleClose, technologyId }) => {
    const navigate = useNavigate();

    const handleDelete = () => {
        confirm({
            title: 'Are you sure you want to delete this technology?',
            onOk: async () => {
                try {
                    await deleteTechnology(technologyId);
                    handleClose();
                    message.success('Technology deleted successfully!');
                    // Optionally, navigate to another page or refresh the list
                    navigate('/technology-management');
                } catch (error) {
                    message.error('Failed to delete technology.');
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
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
