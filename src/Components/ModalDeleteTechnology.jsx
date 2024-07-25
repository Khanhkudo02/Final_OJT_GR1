import React from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "antd";
import { deleteTechnology } from "../service/TechnologyServices";
import { toast } from "react-toastify";

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
        <Button
          key="submit"
          type="primary"
          danger
          onClick={handleDeleteTechnology}
        >
          Delete
        </Button>,
      ]}
    >
      <p>Are you sure you want to delete this technology?</p>
    </Modal>
  );
};

ModalDeleteTechnology.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  technologyId: PropTypes.string.isRequired,
};

export default ModalDeleteTechnology;
