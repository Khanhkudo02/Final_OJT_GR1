import React, { useState, useEffect } from "react";
import { Button, Input, Select, Table, Modal, Upload } from "antd";
import { postCreateEmployee, fetchAllEmployees, deleteEmployeeById } from "../service/EmployeeServices";
import { PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Column } = Table;

const AddEmployee = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [skills, setSkills] = useState("");
    const [status, setStatus] = useState("active");
    const [department, setDepartment] = useState("");
    const [employees, setEmployees] = useState([]);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const navigate = useNavigate();

    const loadEmployees = async () => {
        try {
            const data = await fetchAllEmployees();
            const filteredData = data.filter(employee => employee.role === "employee"); // Filter by role "employee"
            setEmployees(filteredData);
        } catch (error) {
            console.error("Failed to fetch employees:", error);
        }
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    const handleAddEmployee = async () => {
        if (!name || !email || !password || !dateOfBirth || !address || !phoneNumber || !skills || !status || !department) {
            toast.error("Please fill in all fields.");
            return;
        }

        try {
            await postCreateEmployee(name, email, password, dateOfBirth, address, phoneNumber, skills, status, department, "employee", imageFiles[0]); // Pass the first image file only
            localStorage.setItem("employeeAdded", "true");
            navigate("/employee-management");
        } catch (error) {
            toast.error("Failed to add employee.");
        }
    };

    const handleViewEmployee = (employee) => {
        setSelectedEmployee(employee);
        setViewModalVisible(true);
    };

    const handleDeleteEmployee = async (id) => {
        try {
            await deleteEmployeeById(id);
            toast.success("Employee deleted successfully!");
            loadEmployees(); // Reload the employees list
        } catch (error) {
            toast.error("Failed to delete employee.");
        }
    };

    const handleImageChange = (info) => {
        if (info.fileList) {
            // Save files to state
            setImageFiles(info.fileList.map(file => file.originFileObj));

            // Generate preview URLs
            const previewUrls = info.fileList.map(file => {
                if (file.originFileObj) {
                    return URL.createObjectURL(file.originFileObj);
                }
                return "";
            });
            setImagePreviews(previewUrls);
        }
        return false; // Prevent automatic upload
    };

    return (
        <div className="add-employee">
            <h2>Add New Employee</h2>
            <div className="form-group">
                <label>Name</label>
                <Input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Email</label>
                <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Date of Birth</label>
                <Input
                    type="date"
                    value={dateOfBirth}
                    onChange={(event) => setDateOfBirth(event.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Address</label>
                <Input
                    type="text"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Phone Number</label>
                <Input
                    type="text"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Skills</label>
                <Input
                    type="text"
                    value={skills}
                    onChange={(event) => setSkills(event.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Status</label>
                <Select
                    value={status}
                    onChange={(value) => setStatus(value)}
                    placeholder="Select Status"
                >
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                </Select>
            </div>
            <div className="form-group">
                <label>Department</label>
                <Select
                    value={department}
                    onChange={(value) => setDepartment(value)}
                    placeholder="Select Department"
                >
                    <Option value="Accounting department">Accounting department</Option>
                    <Option value="Audit department">Audit department</Option>
                    <Option value="Sales department">Sales department</Option>
                    <Option value="Administration department">Administration department</Option>
                    <Option value="Human Resources department">Human Resources department</Option>
                    <Option value="Customer Service department">Customer Service department</Option>
                </Select>
            </div>
            <div className="form-group">
                <label>Images</label>
                <Upload
                    accept=".jpg,.jpeg,.png"
                    beforeUpload={() => false} // Prevent automatic upload
                    multiple
                    listType="picture"
                    onChange={handleImageChange}
                >
                    <Button>
                        <PlusOutlined />
                        Upload Images
                    </Button>
                </Upload>
                <div className="image-previews">
                    {imagePreviews.map((preview, index) => (
                        <img key={index} src={preview} alt={`Image Preview ${index}`} width="100%" />
                    ))}
                </div>
            </div>
            <Button
                type="primary"
                onClick={handleAddEmployee}
                disabled={!name || !email || !password || !dateOfBirth || !address || !phoneNumber || !skills || !status || !department}
            >
                Save
            </Button>
            <Button
                style={{ marginLeft: 8 }}
                onClick={() => navigate("/employee-management")}
            >
                Back to Employee Management
            </Button>

            <h2>Existing Employees</h2>
            <Table dataSource={employees} rowKey="key" pagination={false}>
                <Column title="Name" dataIndex="name" key="name" />
                <Column title="Email" dataIndex="email" key="email" />
                <Column title="Date of Birth" dataIndex="dateOfBirth" key="dateOfBirth" />
                <Column title="Address" dataIndex="address" key="address" />
                <Column title="Phone Number" dataIndex="phoneNumber" key="phoneNumber" />
                <Column title="Skills" dataIndex="skills" key="skills" />
                <Column title="Status" dataIndex="status" key="status" />
                <Column title="Department" dataIndex="department" key="department" />
                <Column
                    title="Actions"
                    key="actions"
                    render={(text, record) => (
                        <div>
                            <Button onClick={() => handleViewEmployee(record)}>View</Button>
                            <Button
                                onClick={() => handleDeleteEmployee(record.key)}
                                disabled={record.status !== "inactive"}
                                style={{ marginLeft: 8 }}
                            >
                                Delete
                            </Button>
                        </div>
                    )}
                />
            </Table>
            <Modal
                title="View Employee"
                visible={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setViewModalVisible(false)}>
                        Close
                    </Button>,
                ]}
            >
                {selectedEmployee && (
                    <div>
                        <p>Name: {selectedEmployee.name}</p>
                        <p>Email: {selectedEmployee.email}</p>
                        <p>Date of Birth: {selectedEmployee.dateOfBirth}</p>
                        <p>Address: {selectedEmployee.address}</p>
                        <p>Phone Number: {selectedEmployee.phoneNumber}</p>
                        <p>Skills: {selectedEmployee.skills}</p>
                        <p>Status: {selectedEmployee.status}</p>
                        <p>Department: {selectedEmployee.department}</p>
                        <p>Image:</p>
                        {selectedEmployee.imageUrl && <img src={selectedEmployee.imageUrl} alt="Employee" width="100%" />}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AddEmployee;
