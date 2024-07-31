import { Button, Spin, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchEmployeeById } from "../service/EmployeeServices";

const EmployeeDetails = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const loadEmployee = async () => {
            try {
                const data = await fetchEmployeeById(id);
                setEmployee(data);
                setLoading(false);
            } catch (error) {
                message.error(t('failedToFetchEmployeeDetails'));
                setLoading(false);
            }
        };

        loadEmployee();
    }, [id, t]);

    if (loading) return <Spin size="large" />;

    return (
        <div className="employee-details">
            <h2>{t('employeeDetails')}</h2>
            {employee ? (
                <div>
                    {employee.imageUrl && (
                        <div>
                            <strong>{t('image')}:</strong>
                            <img
                                src={employee.imageUrl}
                                alt="Employee"
                                width="100"
                                height="100"
                                style={{ objectFit: "cover", marginLeft: "10px" }}
                            />
                        </div>
                    )}
                    <p><strong>{t('name')}:</strong> {employee.name}</p>
                    <p><strong>{t('email')}:</strong> {employee.email}</p>
                    <p><strong>{t('phoneNumber')}:</strong> {employee.phoneNumber}</p>
                    <p><strong>{t('skills')}:</strong> {Array.isArray(employee.skills) ? employee.skills.join(', ') : employee.skills}</p>
                    <p><strong>{t('department')}:</strong> {employee.department}</p>
                    <p><strong>{t('status')}:</strong>
                        <span className={employee.status === "active" ? "status-active" : "status-inactive"}>
                            {employee.status ? t(employee.status) : ""}
                        </span>
                    </p>
                    <Button type="primary" onClick={() => navigate("/employee-management")} style={{ marginTop: "16px" }}>
                        {t('backToEmployeeManagement')}
                    </Button>
                </div>
            ) : (
                <p>{t('employeeNotFound')}</p>
            )}
        </div>
    );
};

export default EmployeeDetails;
