import React from "react";
import { Button, Modal, message } from "antd";
import { deleteTechnology } from "../service/TechnologyServices";
import { useNavigate } from "react-router-dom";

const { confirm } = Modal;

const ModalDeleteTechnology = ({ open, handleClose, technologyId }) => {
  const handleDeleteTechnology = async () => {
    try {
      await deleteTechnology(technologyId);
      handleClose();
      toast.success("Technology deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete technology.");
      console.error("Failed to delete technology:", error);
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
