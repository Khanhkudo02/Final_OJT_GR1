import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Input, Upload, Select, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { postCreateEmployee } from "../service/EmployeeServices";
import { toast } from "react-toastify";

const { Option } = Select;

const ModalAddEmployee = ({ open, handleClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [skills, setSkills] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleAddEmployee = async () => {
    try {
      await postCreateEmployee(
        name,
        email,
        password,
        dateOfBirth,
        address,
        phoneNumber,
        skills,
        status,
        imageFile
      );
      handleClose();
      toast.success("Employee added successfully!");
      // Clear the form fields and the image file after successfully adding
      setName("");
      setEmail("");
      setPassword("");
      setDateOfBirth(null);
      setAddress("");
      setPhoneNumber("");
      setSkills([]);
      setStatus(""); // Reset status
      setImageFile(null); // Reset image file
    } catch (error) {
      toast.error("Failed to add employee.");
    }
  };

  const handleImageChange = ({ file }) => {
    if (file.type === "image/png" || file.type === "image/svg+xml") {
      setImageFile(file.originFileObj);
    } else {
      toast.error("Only PNG and SVG images are allowed.");
    }
  };

  const beforeUpload = (file) => {
    handleImageChange({ file });
    return false; // Prevent automatic upload
  };

  const handleSkillsChange = (value) => {
    setSkills(value);
  };

  return (
    <Modal
      title="Add New Employee"
      open={open}
      onCancel={() => {
        handleClose();
        setImageFile(null); // Reset image file when modal is closed
      }}
      footer={[
        <Button key="back" onClick={handleClose}>
          Close
        </Button>,
        <Button key="submit" type="primary" onClick={handleAddEmployee}>
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
          <label className="form-label">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Birth</label>
          <DatePicker
            value={dateOfBirth}
            onChange={(date) => setDateOfBirth(date)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <Input
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <Input
            type="text"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Skills</label>
          <Select
            mode="multiple"
            value={skills}
            onChange={handleSkillsChange}
            placeholder="Select Skills"
          >
            {/* Replace with your actual skills options */}
            <Option value="JavaScript">JavaScript</Option>
            <Option value="React">React</Option>
            <Option value="Node.js">Node.js</Option>
          </Select>
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <Select
            value={status}
            onChange={(value) => setStatus(value)}
            placeholder="Select Status"
          >
            <Option value="involved">Involved</Option>
            <Option value="available">Available</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </div>
        <div className="mb-3">
          <Upload accept=".png,.svg" beforeUpload={beforeUpload}>
            <Button icon={<PlusOutlined />}>Select Image (PNG/SVG only)</Button>
          </Upload>
        </div>
      </div>
    </Modal>
  );
};

export default ModalAddEmployee;