import React, { useState, useEffect } from "react";
import { Button, Input, Select, Table, Modal, Upload, Space } from "antd";
import {
  postCreateEmployee,
  fetchAllEmployees,
  deleteEmployeeById,
} from "../service/EmployeeServices";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const { Column } = Table;

// Define department options
const departmentOptions = [
  { value: "accounting", label: "Accounting Department" },
  { value: "audit", label: "Audit Department" },
  { value: "sales", label: "Sales Department" },
  { value: "administration", label: "Administration Department" },
  { value: "human_resource", label: "Human Resources Department" },
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
      const filteredData = data.filter(
        (employee) => employee.role === "employee"
      ); // Filter by role "employee"
      setEmployees(filteredData);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleAddEmployee = async () => {
    if (
      !name ||
      !email ||
      !password ||
      !dateOfBirth ||
      !address ||
      !phoneNumber ||
      skills.length === 0 ||
      !status ||
      !department
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await postCreateEmployee(
        name,
        email,
        password,
        dateOfBirth,
        address,
        phoneNumber,
        skills,
        status,
        department,
        "employee",
        imageFiles[0]
      ); // Pass the first image file only
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

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, "");
    // Limit to 10 digits
    if (numericValue.length <= 10) {
      setPhoneNumber(numericValue);
    }
  };

  const handleImageChange = (info) => {
    if (info.fileList) {
      // Save files to state
      setImageFiles(info.fileList.map((file) => file.originFileObj));

      // Generate preview URLs
      const previewUrls = info.fileList.map((file) => {
        if (file.originFileObj) {
          return URL.createObjectURL(file.originFileObj);
        }
        return "";
      });
      setImagePreviews(previewUrls);
    }
    return false; // Prevent automatic upload
  };

  const getSkillLabel = (value) => {
    const skill = skillOptions.find((option) => option.value === value);
    return skill ? skill.label : value;
  };

  return (
    <div className="add-employee">
      <h2>Add New Employee</h2>
      <div className="form-group">
        <label>{t("name")}</label>
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
          placeholder="Select Skills"
          style={{ width: "100%" }}
        >
          {skillOptions.map((skill) => (
            <Option key={skill.value} value={skill.value}>
              {skill.label}
            </Option>
          ))}
        </Select>
      </div>
      <div className="form-group">
        <label>{t("status")}</label>
        <Select
          value={status}
          onChange={(value) => setStatus(value)}
          placeholder="Select Status"
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
          placeholder="Select Department"
          style={{ width: "100%" }}
        >
          {departmentOptions.map((dept) => (
            <Option key={dept.value} value={dept.value}>
              {dept.label}
            </Option>
          ))}
        </Select>
      </div>
      <div className="form-group">
        <label>{t("images")}</label>
        <Upload
          accept=".jpg,.jpeg,.png"
          beforeUpload={() => false} // Prevent automatic upload
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
            <img
              key={index}
              src={preview}
              alt={`Image Preview ${index}`}
              width="100%"
            />
          ))}
        </div>
      </div>
      <Button
        type="primary"
        onClick={handleAddEmployee}
        disabled={
          !name ||
          !email ||
          !password ||
          !dateOfBirth ||
          !address ||
          !phoneNumber ||
          skills.length === 0 ||
          !status ||
          !department
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

      <h2>{t("existingEmployees")}</h2>
      <Table dataSource={employees} rowKey="key" pagination={false}>
        <Column title={t("name")} dataIndex="name" key="name" />
        <Column title={t("email")} dataIndex="email" key="email" />
        <Column
          title={t("dateOfBirth")}
          dataIndex="dateOfBirth"
          key="dateOfBirth"
        />
        <Column title={t("address")} dataIndex="address" key="address" />
        <Column
          title={t("phoneNumber")}
          dataIndex="phoneNumber"
          key="phoneNumber"
        />
        <Column
          className="length-cell"
          title={t("skills")}
          dataIndex="skills"
          key="skills"
          render={(text) => {
            if (Array.isArray(text)) {
              return text
                .map((skill) =>
                  skill
                    .replace(/_/g, " ") // Thay thế dấu gạch dưới bằng dấu cách
                    .split(" ")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ")
                )
                .join(", ");
            }
            return text;
          }}
        />
        <Column
          title={t("status")}
          dataIndex="status"
          key="status"
          render={(text) => {
            const className =
              text === "active" ? "status-active" : "status-inactive";
            return (
              <span className={className}>
                {text ? text.charAt(0).toUpperCase() + text.slice(1) : ""}
              </span>
            );
          }}
        />
        {/* <Column title="Department" dataIndex="department" key="department" /> */}
        <Column
          title={t("department")}
          dataIndex="department"
          key="department"
          render={(text) => {
            if (typeof text === "string") {
              return text
                .replace(/_/g, " ")
                .split(" ") // Chia chuỗi thành mảng các từ
                .map(
                  (word) =>
                    word
                      .toLowerCase() // Chuyển toàn bộ từ thành chữ thường trước
                      .replace(/^[a-z]/, (char) => char.toUpperCase()) // Chỉ viết hoa chữ cái đầu tiên
                )
                .join(" ");
            }
            return text;
          }}
        />

        <Column
          title={t("actions")}
          key="actions"
          render={(text, record) => (
            <Space>
              <Button
                icon={<EyeOutlined />}
                style={{ color: "green", borderColor: "green" }}
                onClick={() => handleViewEmployee(record)}
              />
              <Button
                icon={<DeleteOutlined />}
                style={{ color: "red", borderColor: "red" }}
                onClick={() => handleDeleteEmployee(record.key)}
              />
            </Space>
          )}
        />
      </Table>
      <Modal
        title={t("viewEmployee")}
        open={viewModalVisible}
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
            <p>
              {t("skills")}:{" "}
              {Array.isArray(selectedEmployee.skills)
                ? selectedEmployee.skills
                    .map(
                      (skill) =>
                        skill
                          .replace(/_/g, " ") // Thay thế dấu gạch dưới bằng dấu cách
                          .split(" ") // Chia chuỗi thành mảng các từ
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase() // Chỉ viết hoa chữ cái đầu tiên
                          )
                          .join(" ") // Kết hợp các từ lại thành chuỗi với dấu cách giữa các từ
                    )
                    .join(", ")
                : ""}
            </p>
            <p>
              {t("status")}:{" "}
              {selectedEmployee.status
                ? selectedEmployee.status.charAt(0).toUpperCase() +
                  selectedEmployee.status.slice(1).toLowerCase()
                : ""}
            </p>

            <p>
              {t("department")}:{" "}
              {selectedEmployee.department
                ? selectedEmployee.department
                    .replace(/_/g, " ") // Thay thế dấu gạch dưới bằng dấu cách
                    .split(" ") // Chia chuỗi thành mảng các từ
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase() // Chỉ viết hoa chữ cái đầu tiên
                    )
                    .join(" ") // Kết hợp các từ lại thành chuỗi với dấu cách giữa các từ
                : ""}
            </p>
            <p>{t("images")}:</p>
            {selectedEmployee.imageUrl && (
              <img
                src={selectedEmployee.imageUrl}
                alt="Employee"
                width="100%"
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AddEmployee;