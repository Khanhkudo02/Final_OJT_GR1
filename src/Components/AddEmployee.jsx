import React, { useState, useEffect } from "react";
import { Button, Input, Select, Table, Modal } from "antd";
import {
    postCreateEmployee,
    fetchAllEmployees,
    deleteEmployeeById,
} from "../service/EmployeeServices";
import { PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Column } = Table;

const AddEmployee = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("active");
    const [employees, setEmployees] = useState([]);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const navigate = useNavigate();

    const loadEmployees = async () => {
        try {
            const data = await fetchAllEmployees();
            const filteredData = data.filter(employee => !employee.isAdmin); // Filter out admin employees
            setEmployees(filteredData);
        } catch (error) {
            console.error("Failed to fetch employees:", error);
        }
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    const handleAddEmployee = async () => {
        if (!name || !email || !department || !status) {
            toast.error("Please fill in all fields.");
            return;
        }

        try {
            await postCreateEmployee(name, email, department, status);
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
                <label>Department</label>
                <Input
                    type="text"
                    value={department}
                    onChange={(event) => setDepartment(event.target.value)}
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
            <Button
                type="primary"
                onClick={handleAddEmployee}
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

            <h2>Existing Employees</h2>
            <Table dataSource={employees} rowKey="key" pagination={false}>
                <Column title="Name" dataIndex="name" key="name" />
                <Column title="Email" dataIndex="email" key="email" />
                <Column title="Department" dataIndex="department" key="department" />
                <Column title="Status" dataIndex="status" key="status" />
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
                        <p>
                            <strong>Name:</strong> {selectedEmployee.name}
                        </p>
                        <p>
                            <strong>Email:</strong> {selectedEmployee.email}
                        </p>
                        <p>
                            <strong>Department:</strong> {selectedEmployee.department}
                        </p>
                        <p>
                            <strong>Status:</strong> {selectedEmployee.status}
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AddEmployee;
