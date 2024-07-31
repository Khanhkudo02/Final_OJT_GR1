import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, Select, Upload } from "antd";
import moment from 'moment';
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchEmployeeById, putUpdateEmployee } from "../service/EmployeeServices";

const { Option } = Select;

// Define department options
const departmentOptions = [
    { value: "accounting", label: "accounting" },
    { value: "audit", label: "audit" },
    { value: "sales", label: "sales" },
    { value: "administration", label: "administration" },
    { value: "hr", label: "hr" },
    { value: "customer_service", label: "customer_service" },
];

// Define skill options
const skillOptions = [
    { value: "active_listening", label: "active_listening" },
    { value: "communication", label: "communication" },
    { value: "computer", label: "computer" },
    { value: "customer_service", label: "customer_service" },
    { value: "interpersonal", label: "interpersonal" },
    { value: "leadership", label: "leadership" },
    { value: "management", label: "management" },
    { value: "problem_solving", label: "problem_solving" },
    { value: "time_management", label: "time_management" },
    { value: "transferable", label: "transferable" },
];

const EditEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation(); // useTranslation hook

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState([]);
    const [status, setStatus] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [skills, setSkills] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [oldImageUrl, setOldImageUrl] = useState("");

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
                    setSkills(employee.skills || []);
                    setOldImageUrl(employee.imageUrl || ""); // Set old image URL
                } else {
                    toast.error(t("employeeNotFound"));
                }
            } catch (error) {
                toast.error(t("failedToFetchEmployeeData"));
            }
        };

        loadEmployee();
    }, [id, t]);

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
            toast.error(t("pleaseFillAllFields"));
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
                imageFile,
                oldImageUrl // Pass old image URL for deletion
            );
            toast.success(t("employeeUpdatedSuccessfully"));
            navigate("/employee-management");
        } catch (error) {
            toast.error(t("failedToUpdateEmployee"));
            console.error("Error details:", error);
        }
    };

    const handleImageChange = ({ target }) => {
        const file = target.files[0];
        if (file) {
            // Generate image preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setImageFile(file);
        }
    };

    const beforeUpload = (file) => {
        handleImageChange({ target: { files: [file] } });
        return false; // Prevent automatic upload
    };

    return (
        <div>
            <h2>{t("editEmployee")}</h2>

            <div className="form-group">
                <label>{t("name")}</label>
                <Input
                    placeholder={t("name")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>{t("email")}</label>
                <Input
                    placeholder={t("email")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled
                />
            </div>
            <div className="form-group">
                <label>{t("department")}</label>
                <Select
                    mode="multiple"
                    placeholder={t("department")}
                    value={department}
                    onChange={(value) => setDepartment(value)}
                >
                    {departmentOptions.map(dept => (
                        <Option key={dept.value} value={dept.value}>
                            {t(dept.label)}
                        </Option>
                    ))}
                </Select>
            </div>
            <div className="form-group">
                <label>{t("status")}</label>
                <Select
                    placeholder={t("status")}
                    value={status}
                    onChange={(value) => setStatus(value)}
                >
                    <Option value="active">{t("active")}</Option>
                    <Option value="inactive">{t("inactive")}</Option>
                </Select>
            </div>
            <div className="form-group">
                <label>{t("dateOfBirth")}</label>
                <Input
                    type="date"
                    value={moment(dateOfBirth).format('YYYY-MM-DD')}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>{t("address")}</label>
                <Input
                    placeholder={t("address")}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>{t("phoneNumber")}</label>
                <Input
                    placeholder={t("phoneNumber")}
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    maxLength={10}
                />
            </div>
            <div className="form-group">
                <label>{t("skills")}</label>
                <Select
                    mode="multiple"
                    placeholder={t("skills")}
                    value={skills}
                    onChange={(value) => setSkills(value)}
                >
                    {skillOptions.map(skill => (
                        <Option key={skill.value} value={skill.value}>
                            {t(skill.label)}
                        </Option>
                    ))}
                </Select>
            </div>
            <div className="form-group">
                <label>{t("uploadImage")}</label>
                <Upload
                    accept=".jpg,.jpeg,.png"
                    beforeUpload={beforeUpload}
                    listType="picture"
                    showUploadList={false}
                >
                    <Button icon={<PlusOutlined />}>{t("uploadImageButton")}</Button>
                </Upload>
                {imagePreview && (
                    <div style={{ marginTop: 16 }}>
                        <img
                            src={imagePreview}
                            alt="Image Preview"
                            width="30%"
                        />
                    </div>
                )}
            </div>
            <Button
                type="primary"
                onClick={handleUpdateEmployee}
                disabled={!name || !email || department.length === 0 || !status || !dateOfBirth || !address || !phoneNumber || skills.length === 0}
            >
                {t("save")}
            </Button>
            <Button
                style={{ marginLeft: 8 }}
                onClick={() => navigate("/employee-management")}
            >
                {t("backToEmployeeManagement")}
            </Button>
        </div>
    );
};

export default EditEmployee;
