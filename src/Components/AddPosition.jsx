import React, { useState, useEffect } from "react";
import { Button, Input, Select, Table } from "antd";
import { postCreatePosition, fetchAllPositions } from "../service/PositionServices";
import { PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../Components/AddPosition.jsx";

const { Option } = Select;
const { Column } = Table;

const AddPosition = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("active");
    const [positions, setPositions] = useState([]);

    const navigate = useNavigate();

    const loadPositions = async () => {
        try {
            const data = await fetchAllPositions();
            setPositions(data);
        } catch (error) {
            console.error("Failed to fetch positions:", error);
        }
    };

    useEffect(() => {
        loadPositions();
    }, []);

    const handleAddPosition = async () => {
        if (!name || !description || !department || !status) {
            toast.error("Please fill in all fields.");
            return;
        }
    
        try {
            await postCreatePosition(name, description, department, status);
            localStorage.setItem('positionAdded', 'true');
            navigate("/position-management");
        } catch (error) {
            toast.error("Failed to add position.");
        }
    };
    

    return (
        <div className="add-position">
            <h2>Add New Position</h2>
            <div className="form-group">
                <label>Name</label>
                <Input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Description</label>
                <Input
                    type="text"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
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
                onClick={handleAddPosition}
                disabled={!name || !description || !department || !status}
            >
                Save
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => navigate("/position-management")}>
                Back to Position Management
            </Button>

            <h2>Existing Positions</h2>
            <Table dataSource={positions} rowKey="key" pagination={false}>
                <Column title="Name" dataIndex="name" key="name" />
                <Column title="Description" dataIndex="description" key="description" />
                <Column title="Department" dataIndex="department" key="department" />
                <Column title="Status" dataIndex="status" key="status" />
            </Table>
        </div>
    );
};

export default AddPosition;
