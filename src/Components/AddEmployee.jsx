import { PlusOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Select, Table, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteEmployeeById, fetchAllEmployees, postCreateEmployee } from "../service/EmployeeServices";

const { Option } = Select;
const { Column } = Table;

const departmentOptions = [
    { value: "accounting", label: "Accounting Department" },
    { value: "audit", label: "Audit Department" },
    { value: "sales", label: "Sales Department" },
    { value: "administration", label: "Administration Department" },
    { value: "hr", label: "Human Resources Department" },
    { value: "customer_service", label: "Customer Service Department" },
];

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

const AddEmployee = () => {
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [skills, setSkills] = useState([]);
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
            const filteredData = data.filter(employee => employee.role === "employee");
            setEmployees(filteredData);
        } catch (error) {
            console.error("Failed to fetch employees:", error);
        }
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    const handleAddEmployee = async () => {
        if (!name || !email || !password || !dateOfBirth || !address || !phoneNumber || skills.length === 0 || !status || !department) {
            toast.error(t("pleaseFillAllFields"));
            return;
        }

        try {
            await postCreateEmployee(name, email, password, dateOfBirth, address, phoneNumber, skills, status, department, "employee", imageFiles[0]); 
            localStorage.setItem("employeeAdded", "true");
            navigate("/employee-management");
        } catch (error) {
            toast.error(t("failedToAddEmployee"));
        }
    };

    const handleViewEmployee = (employee) => {
        setSelectedEmployee(employee);
        setViewModalVisible(true);
    };

    const handleDeleteEmployee = async (id) => {
        try {
            await deleteEmployeeById(id);
            toast.success(t("employeeDeleted"));
            loadEmployees();
        } catch (error) {
            toast.error(t("failedToDeleteEmployee"));
        }
    };

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        const numericValue = value.replace(/\D/g, '');
        if (numericValue.length <= 10) {
            setPhoneNumber(numericValue);
        }
    };

    const handleImageChange = (info) => {
        if (info.fileList) {
            setImageFiles(info.fileList.map(file => file.originFileObj));

            const previewUrls = info.fileList.map(file => {
                if (file.originFileObj) {
                    return URL.createObjectURL(file.originFileObj);
                }
                return "";
            });
            setImagePreviews(previewUrls);
        }
        return false;
    };

    return (
        <div className="add-employee">
            <h2>{t("addNewEmployee")}</h2>
            <div className="form-group">
                <label>{t("name")}</label>
                <Input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
            </div>
            <div className="form-group">
                <label>{t("email")}</label>
                <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
            </div>
            <div className="form-group">
                <label>{t("password")}</label>
                <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
            </div>
            <div className="form-group">
                <label>{t("dateOfBirth")}</label>
                <Input
                    type="date"
                    value={dateOfBirth}
                    onChange={(event) => setDateOfBirth(event.target.value)}
                />
            </div>
            <div className="form-group">
                <label>{t("address")}</label>
                <Input
                    type="text"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                />
            </div>
            <div className="form-group">
                <label>{t("phoneNumber")}</label>
                <Input
                    type="text"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    maxLength={10}
                />
            </div>
            <div className="form-group">
                <label>{t("skills")}</label>
                <Select
                    mode="multiple"
                    value={skills}
                    onChange={(value) => setSkills(value)}
                    placeholder={t("selectSkills")}
                >
                    {skillOptions.map(skill => (
                        <Option key={skill.value} value={skill.value}>
                            {t(skill.label)}
                        </Option>
                    ))}
                </Select>
            </div>
            <div className="form-group">
                <label>{t("status")}</label>
                <Select
                    value={status}
                    onChange={(value) => setStatus(value)}
                    placeholder={t("selectStatus")}
                >
                    <Option value="active">{t("active")}</Option>
                    <Option value="inactive">{t("inactive")}</Option>
                </Select>
            </div>
            <div className="form-group">
                <label>{t("department")}</label>
                <Select
                    value={department}
                    onChange={(value) => setDepartment(value)}
                    placeholder={t("selectDepartment")}
                >
                    {departmentOptions.map(dept => (
                        <Option key={dept.value} value={dept.value}>
                            {t(dept.label)}
                        </Option>
                    ))}
                </Select>
            </div>
            <div className="form-group">
                <label>{t("images")}</label>
                <Upload
                    accept=".jpg,.jpeg,.png"
                    beforeUpload={() => false}
                    multiple
                    listType="picture"
                    onChange={handleImageChange}
                >
                    <Button>
                        <PlusOutlined />
                        {t("uploadImages")}
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
                disabled={!name || !email || !password || !dateOfBirth || !address || !phoneNumber || skills.length === 0 || !status || !department}
            >
                {t("save")}
            </Button>
            <Button
                style={{ marginLeft: 8 }}
                onClick={() => navigate("/employee-management")}
            >
                {t("backToEmployeeManagement")}
            </Button>

            <h2>{t("existingEmployees")}</h2>
            <Table dataSource={employees} rowKey="key" pagination={false}>
                <Column title={t("name")} dataIndex="name" key="name" />
                <Column title={t("email")} dataIndex="email" key="email" />
                <Column title={t("dateOfBirth")} dataIndex="dateOfBirth" key="dateOfBirth" />
                <Column title={t("address")} dataIndex="address" key="address" />
                <Column title={t("phoneNumber")} dataIndex="phoneNumber" key="phoneNumber" />
                <Column
                    title={t("skills")}
                    dataIndex="skills"
                    key="skills"
                    render={(skills) => (Array.isArray(skills) ? skills.join(', ') : '')}
                />
                <Column title={t("status")} dataIndex="status" key="status" />
                <Column title={t("department")} dataIndex="department" key="department" />
                <Column
                    title={t("actions")}
                    key="actions"
                    render={(text, record) => (
                        <div>
                            <Button onClick={() => handleViewEmployee(record)}>{t("view")}</Button>
                            <Button
                                onClick={() => handleDeleteEmployee(record.key)}
                                disabled={record.status !== "inactive"}
                                style={{ marginLeft: 8 }}
                            >
                                {t("delete")}
                            </Button>
                        </div>
                    )}
                />
            </Table>
            <Modal
                title={t("viewEmployee")}
                visible={viewModalVisible}
                onCancel={() => setViewModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setViewModalVisible(false)}>
                        {t("close")}
                    </Button>,
                ]}
            >
                {selectedEmployee && (
                    <div>
                        <p>{t("name")}: {selectedEmployee.name}</p>
                        <p>{t("email")}: {selectedEmployee.email}</p>
                        <p>{t("dateOfBirth")}: {selectedEmployee.dateOfBirth}</p>
                        <p>{t("address")}: {selectedEmployee.address}</p>
                        <p>{t("phoneNumber")}: {selectedEmployee.phoneNumber}</p>
                        <p>{t("skills")}: {Array.isArray(selectedEmployee.skills) ? selectedEmployee.skills.join(', ') : ''}</p>
                        <p>{t("status")}: {selectedEmployee.status}</p>
                        <p>{t("department")}: {selectedEmployee.department}</p>
                        <p>{t("image")}:</p>
                        {selectedEmployee.imageUrl && <img src={selectedEmployee.imageUrl} alt="Employee" width="100%" />}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AddEmployee;
