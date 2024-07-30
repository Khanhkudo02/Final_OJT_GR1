import React, { useState, useEffect } from "react";
import { Input, Select, Upload, Button, Layout } from "antd";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { putUpdateEmployee, fetchEmployeeById } from "../service/EmployeeServices";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Header } = Layout;

// Define department options
const departmentOptions = [
    { value: "accounting", label: "Accounting Department" },
    { value: "audit", label: "Audit Department" },
    { value: "sales", label: "Sales Department" },
    { value: "administration", label: "Administration Department" },
    { value: "hr", label: "Human Resources Department" },
    { value: "customer_service", label: "Customer Service Department" },
];

// Define skill options
const skillOptions = [
    { value: "active_listening", label: "Active Listening Skills" },
    { value: "communication", label: "Communication Skills" },
    { value: "computer", label: "Computer Skills" },
    { value: "customer_service", label: "Customer Service Skills" },
    { value: "interpersonal", label: "Interpersonal Skills" },
    { value: "leadership", label: "Leadership Skills" },
    { value: "management", label: "Management Skills" },
    { value: "problem_solving", label: "Problem-Solving Skills" },
    { value: "time_management", label: "Time Management Skills" },
    { value: "transferable", label: "Transferable Skills" },
];

const EditEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState([]);
    const [status, setStatus] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [skills, setSkills] = useState([]);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const loadEmployee = async () => {
            try {
                const employee = await fetchEmployeeById(id);
                if (employee) {
                    setName(employee.name || "");
                    setEmail(employee.email || "");
                    setDepartment(employee.department || []);
                    setStatus(employee.status || "");
                    setDateOfBirth(employee.dateOfBirth || "");
                    setAddress(employee.address || "");
                    setPhoneNumber(employee.phoneNumber || "");
                    setSkills(employee.skills || []); // Ensure skills is an array
                } else {
                    toast.error("Employee not found.");
                }
            } catch (error) {
                toast.error("Failed to fetch employee data.");
            }
        };

        loadEmployee();
    }, [id]);

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        // Remove all non-numeric characters
        const numericValue = value.replace(/\D/g, '');
        // Limit to 10 digits
        if (numericValue.length <= 10) {
            setPhoneNumber(numericValue);
        }
    };

    const handleUpdateEmployee = async () => {
        if (!name || !email || department.length === 0 || !status || !dateOfBirth || !address || !phoneNumber || skills.length === 0) {
            toast.error("Please fill in all fields.");
            return;
        }

        try {
            await putUpdateEmployee(
                id,
                name,
                email,
                dateOfBirth,
                address,
                phoneNumber,
                skills,
                status,
                department,
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
        if (file && file.originFileObj) {
            setImageFile(file.originFileObj);
        }
    };

    const beforeUpload = (file) => {
        handleImageChange({ file });
        return false; // Prevent automatic upload
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
                <Select
                    mode="multiple"
                    placeholder="Select Department"
                    value={department}
                    onChange={(value) => setDepartment(value)}
                >
                    {departmentOptions.map(dept => (
                        <Option key={dept.value} value={dept.value}>
                            {dept.label}
                        </Option>
                    ))}
                </Select>
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
                <label>Date of Birth</label>
                <Input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Address</label>
                <Input
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Phone Number</label>
                <Input
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    maxLength={10}
                />
            </div>
            <div className="form-group">
                <label>Skills</label>
                <Select
                    mode="multiple"
                    placeholder="Select Skills"
                    value={skills}
                    onChange={(value) => setSkills(value)}
                >
                    {skillOptions.map(skill => (
                        <Option key={skill.value} value={skill.value}>
                            {skill.label}
                        </Option>
                    ))}
                </Select>
            </div>
            <div className="form-group">
                <label>Upload Image</label>
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
                disabled={!name || !email || department.length === 0 || !status || !dateOfBirth || !address || !phoneNumber || skills.length === 0}
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
