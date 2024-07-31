import React, { useState, useEffect } from "react";
import { Input, Select, Upload, Button, Layout } from "antd";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import {
    putUpdateEmployee,
    fetchEmployeeById,
} from "../service/EmployeeServices";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Header } = Layout;

const EditEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const loadEmployee = async () => {
            try {
                console.log(`Loading employee with ID: ${id}`);
                const employee = await fetchEmployeeById(id);
                if (employee) {
                    console.log("Loaded employee:", employee);
                    setName(employee.name || "");
                    setEmail(employee.email || "");
                    setDepartment(employee.department || "");
                    setStatus(employee.status || "");
                } else {
                    toast.error("Employee not found.");
                }
            } catch (error) {
                toast.error("Failed to fetch employee data.");
            }
        };

        loadEmployee();
    }, [id]);

    const handleUpdateEmployee = async () => {
        if (!name || !email || !department || !status) {
            toast.error("Please fill in all fields.");
            return;
        }

        try {
            await putUpdateEmployee(
                id,
                name,
                email,
                department,
                status,
                imageFile
            );
            toast.success("Employee updated successfully!");
            navigate("/employee-management");
        } catch (error) {
            toast.error("Failed to update employee.");
            console.error("Error details:", error);
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

    return (
        <div>
            <h2>Edit Employee</h2>

            <div className="form-group">
                <label>Name</label>
                <Input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Email</label>
                <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Department</label>
                <Input
                    placeholder="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Status</label>
                <Select
                    placeholder="Select Status"
                    value={status}
                    onChange={(value) => setStatus(value)}
                >
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                </Select>
            </div>
            <div className="form-group">
                <label>Upload Image (PNG or SVG only)</label>
                <Upload
                    name="image"
                    listType="picture"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleImageChange}
                >
                    <Button icon={<PlusOutlined />}>Upload</Button>
                </Upload>
            </div>
            <Button
                type="primary"
                onClick={handleUpdateEmployee}
                disabled={!name || !email || !department || !status}
            >
                Save
            </Button>
            <Button
                style={{ marginLeft: 8 }}
                onClick={() => navigate("/employee-management")}
            >
                Back to Employee Management
            </Button>
        </div>
    );
};

export default EditEmployee;
