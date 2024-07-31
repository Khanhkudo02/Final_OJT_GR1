import React, { useState, useEffect } from "react";
import { Input, Select, Upload, Button } from "antd";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import {
  putUpdateEmployee,
  fetchEmployeeById,
} from "../service/EmployeeServices";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { useTranslation } from 'react-i18next';

const { Option } = Select;

// Define department options
const departmentOptions = [
  { value: "accounting", label: "Accounting Department" },
  { value: "audit", label: "Audit Department" },
  { value: "sales", label: "Sales Department" },
  { value: "administration", label: "Administration Department" },
  { value: "human_resources", label: "Human Resources Department" },
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
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState([]);
  const [status, setStatus] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [skills, setSkills] = useState([]);
  const [fileList, setFileList] = useState([]);
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

          // Set fileList for existing image
          if (employee.imageUrl) {
            setFileList([
              {
                uid: "-1",
                name: "attachment",
                status: "done",
                url: employee.imageUrl,
              },
            ]);
          }
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
    const numericValue = value.replace(/\D/g, "");
    // Limit to 10 digits
    if (numericValue.length <= 10) {
      setPhoneNumber(numericValue);
    }
  };

  const handleUpdateEmployee = async () => {
    if (
      !name ||
      !email ||
      department.length === 0 ||
      !status ||
      !dateOfBirth ||
      !address ||
      !phoneNumber ||
      skills.length === 0
    ) {
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
        fileList.length > 0 ? fileList[0].originFileObj : null,
        oldImageUrl // Pass old image URL for deletion
      );
      toast.success("Employee updated successfully!");
      navigate("/employee-management");
    } catch (error) {
      toast.error("Failed to update employee.");
      console.error("Error details:", error);
    }
  };

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const beforeUpload = (file) => {
    handleImageChange({ fileList: [file] });
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
        />
      </div>
      <div className="form-group">
        <label>{t("department")}</label>
        <Select
          placeholder={t("department")}
          value={department}
          onChange={(value) => setDepartment(value)}
        >
          {departmentOptions.map((dept) => (
            <Option key={dept.value} value={dept.value}>
              {dept.label}
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
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
      </div>
      <div className="form-group">
        <label>{t("dateOfBirth")}</label>
        <Input
          type="date"
          value={moment(dateOfBirth).format("YYYY-MM-DD")}
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
          {skillOptions.map((skill) => (
            <Option key={skill.value} value={skill.value}>
              {skill.label}
            </Option>
          ))}
        </Select>
      </div>
      <div className="form-group">
        <label>{t("uploadImage")}</label>
        <Upload
          accept=".jpg,.jpeg,.png"
          beforeUpload={beforeUpload}
          fileList={fileList}
          onChange={handleImageChange}
          listType="picture"
          showUploadList={false}
        >
          <Button icon={<PlusOutlined />}>{t("uploadImageButton")}</Button>
        </Upload>
        {fileList.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <img src={fileList[0].url} alt="Image Preview" width="30%" />
          </div>
        )}
      </div>
      <Button
        type="primary"
        onClick={handleUpdateEmployee}
        disabled={
          !name ||
          !email ||
          department.length === 0 ||
          !status ||
          !dateOfBirth ||
          !address ||
          !phoneNumber ||
          skills.length === 0
        }
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