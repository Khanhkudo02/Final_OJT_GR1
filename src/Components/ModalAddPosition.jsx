import React, { useState } from "react";
import { Modal, Button, Input, Select } from "antd";
import { postCreatePosition } from "../service/PositionServices";
import { toast } from "react-toastify";

const { Option } = Select;

const ModalAddPosition = ({ open, handleClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("active");

  const handleAddPosition = async () => {
    try {
      await postCreatePosition(name, description, department, status);
      handleClose();
      toast.success("Position added successfully!");
      setName("");
      setDescription("");
      setDepartment("");
      setStatus("active");
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
          <label className="form-label">Department</label>
          <Input
            type="text"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <Select
            value={status}
            onChange={(value) => setStatus(value)}
            placeholder="Select Status"
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </div>
      </div>
    </Modal>
  );
};

export default ModalAddPosition;
