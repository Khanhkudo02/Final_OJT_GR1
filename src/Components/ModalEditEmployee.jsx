import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Upload, Select, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { putUpdateEmployee } from "../service/EmployeeServices";
import { toast } from "react-toastify";

const { Option } = Select;

const ModalEditEmployee = ({ open, handleClose, dataEmployeeEdit }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [skills, setSkills] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (dataEmployeeEdit) {
            setName(dataEmployeeEdit.name || "");
            setEmail(dataEmployeeEdit.email || "");
            setDateOfBirth(dataEmployeeEdit.dateOfBirth ? moment(dataEmployeeEdit.dateOfBirth, 'YYYY-MM-DD') : null);
            setAddress(dataEmployeeEdit.address || "");
            setPhoneNumber(dataEmployeeEdit.phoneNumber || "");
            setSkills(dataEmployeeEdit.skills || []);
            setStatus(dataEmployeeEdit.status || "");
            setImageFile(null);
        }
    }, [dataEmployeeEdit]);

    const handleEditEmployee = async () => {
        try {
            const formattedDateOfBirth = dateOfBirth ? moment(dateOfBirth).format('YYYY-MM-DD') : null;
            const res = await putUpdateEmployee(
                dataEmployeeEdit.key,
                name,
                email,
                formattedDateOfBirth,
                address,
                phoneNumber,
                skills,
                status,
                imageFile
            );
            if (res) {
                handleClose();
                toast.success("Employee updated successfully!");
            } else {
                toast.error("Failed to update employee.");
            }
        } catch (error) {
            toast.error("An error occurred.");
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
        return false;
    };

    const handleSkillsChange = (value) => {
        setSkills(value);
    };

    return (
        <Modal
            title="Edit Employee"
            open={open}
            onCancel={() => {
                handleClose();
                setImageFile(null);
            }}
            footer={[
                <Button key="back" onClick={handleClose}>
                    Close
                </Button>,
                <Button key="submit" type="primary" onClick={handleEditEmployee}>
                    Save
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
                    <label className="form-label">Email</label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
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
                    <Upload
                        accept=".png,.svg"
                        beforeUpload={beforeUpload}
                    >
                        <Button icon={<PlusOutlined />}>Select Image (PNG/SVG only)</Button>
                    </Upload>
                </div>
            </div>
        </Modal>
    );
};

export default ModalEditEmployee;