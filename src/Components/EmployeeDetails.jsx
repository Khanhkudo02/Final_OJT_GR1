import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEmployeeById } from "../service/EmployeeServices";
import { Button, Spin, message } from 'antd';

const EmployeeDetails = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadEmployee = async () => {
            try {
                const data = await fetchEmployeeById(id);
                setEmployee(data);
                setLoading(false);
            } catch (error) {
                message.error('Failed to fetch employee details.');
                setLoading(false);
            }
        };

        loadEmployee();
    }, [id]);

    if (loading) return <Spin size="large" />;

    return (
        <div className="employee-details">
            <h2>Employee Details</h2>
            {employee ? (
                <div>
                    {employee.imageUrl && (
                        <div>
                            <strong>Image:</strong>
                            <img
                                src={employee.imageUrl}
                                alt="Employee"
                                width="100"
                                height="100"
                                style={{ objectFit: "cover", marginLeft: "10px" }}
                            />
                        </div>
                    )}
                    <p><strong>Name:</strong> {employee.name}</p>
                    <p><strong>Email:</strong> {employee.email}</p>
                    <p><strong>Phone Number:</strong> {employee.phoneNumber}</p>
                    <p><strong>Skills:</strong> {employee.skills}</p>
                    <p><strong>Department:</strong> {employee.department}</p>
                    <p><strong>Status:</strong>
                        <span className={employee.status === "active" ? "status-active" : "status-inactive"}>
                            {employee.status ? employee.status.charAt(0).toUpperCase() + employee.status.slice(1) : ""}
                        </span>
                    </p>
                    <Button type="primary" onClick={() => navigate("/employee-management")} style={{ marginTop: "16px" }}>
                        Back to Employee Management
                    </Button>
                </div>
            ) : (
                <p>Employee not found.</p>
            )}
        </div>
    );
};

export default EmployeeDetails;
