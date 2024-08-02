import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Space, Table, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  checkEmailExists,
  deleteEmployeeById,
  fetchAllEmployees,
  postCreateEmployee,
  fetchAllPositions,
} from "../service/EmployeeServices";

const { Option } = Select;
const { Column } = Table;

const AddEmployee = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm(); // Using Ant Design's Form
  const [employees, setEmployees] = useState([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [positions, setPositions] = useState([]);

  const navigate = useNavigate();

  const departmentOptions = [
    { value: "accounting", label: t("departmentAccounting") },
    { value: "audit", label: t("departmentAudit") },
    { value: "sales", label: t("departmentSales") },
    { value: "administration", label: t("departmentAdministration") },
    { value: "human_resource", label: t("departmentHumanResources") },
    { value: "customer_service", label: t("departmentCustomerService") },
  ];

  const skillOptions = [
    { value: "active_listening", label: t("skillActiveListening") },
    { value: "communication", label: t("skillCommunication") },
    { value: "computer", label: t("skillComputer") },
    { value: "customer_service", label: t("skillCustomerService") },
    { value: "interpersonal", label: t("skillInterpersonal") },
    { value: "leadership", label: t("skillLeadership") },
    { value: "management", label: t("skillManagement") },
    { value: "problem_solving", label: t("skillProblemSolving") },
    { value: "time_management", label: t("skillTimeManagement") },
    { value: "transferable", label: t("skillTransferable") },
  ];

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

    const fetchPositions = async () => {
      try {
        const positionsData = await fetchAllPositions();
        setPositions(positionsData.map((pos) => ({ value: pos.key, label: pos.label })));
      } catch (error) {
        console.error("Failed to fetch positions:", error);
      }
    };

    fetchPositions();
  }, []);

  const handleAddEmployee = async (values) => {
    const {
      name,
      email,
      password,
      dateOfBirth,
      address,
      phoneNumber,
      skills,
      status,
      department,
      position,
    } = values;

    // Kiểm tra email đã tồn tại chưa
    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        form.setFields([
          {
            name: "email",
            errors: [t("emailAlreadyExists")],
          },
        ]);
        return; // Dừng xử lý tiếp
      }
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
        position,
        "employee",
        imageFiles[0]
      );
      localStorage.setItem("employeeAdded", "true");
      navigate("/employee-management");
      form.resetFields();
    } catch (error) {
      toast.error(t("failedToAddEmployee"));
    }
  };

  const handleEmailChange = async (e) => {
    const email = e.target.value;
    form.setFieldsValue({ email });

    // Kiểm tra email khi người dùng nhập
    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        form.setFields([
          {
            name: "email",
            errors: [t("emailAlreadyExists")],
          },
        ]);
      } else {
        form.setFields([
          {
            name: "email",
            errors: [],
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to check email existence:", error);
    }
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setViewModalVisible(true);
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await deleteEmployeeById(id);
      toast.success(t("employeeDeletedSuccessfully"));
      loadEmployees(); // Reload the employees list
    } catch (error) {
      toast.error(t("failedToDeleteEmployee"));
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, "");
    // Limit to 10 digits
    if (numericValue.length <= 10) {
      form.setFieldsValue({ phoneNumber: numericValue });
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

  const handleFieldBlur = async (fieldName) => {
    try {
      await form.validateFields([fieldName]);
    } catch (error) {
      // Do nothing, Ant Design will automatically show error message
    }
  };

  const getSkillLabel = (value) => {
    const skill = skillOptions.find((option) => option.value === value);
    return skill ? skill.label : value;
  };

  return (
    <div className="add-employee">
      <h2>{t("addNewEmployee")}</h2>
      <Form
        form={form}
        onFinish={handleAddEmployee}
        layout="vertical"
        initialValues={{ status: "active" }}
      >
        <Form.Item
          label={t("name")}
          name="name"
          rules={[{ required: true, message: t("pleaseEnterName") }]}
        >
          <Input type="text" onBlur={() => handleFieldBlur("name")} />
        </Form.Item>
        <Form.Item
          label={t("email")}
          name="email"
          rules={[
            { required: true, message: t("pleaseEnterEmail") },
            { type: "email", message: t("invalidEmail") },
          ]}
        >
          <Input
            type="email"
            onBlur={() => handleFieldBlur("email")}
            onChange={handleEmailChange}
          />
        </Form.Item>
        <Form.Item
          label={t("password")}
          name="password"
          rules={[
            { required: true, message: t("pleaseEnterPassword") },
            { min: 6, message: t("passwordMinLength") },
          ]}
        >
          <Input type="password" onBlur={() => handleFieldBlur("password")} />
        </Form.Item>
        <Form.Item
          label={t("dateOfBirth")}
          name="dateOfBirth"
          rules={[{ required: true, message: t("pleaseEnterDateOfBirth") }]}
        >
          <Input type="date" onBlur={() => handleFieldBlur("dateOfBirth")} />
        </Form.Item>
        <Form.Item
          label={t("address")}
          name="address"
          rules={[{ required: true, message: t("pleaseEnterAddress") }]}
        >
          <Input type="text" onBlur={() => handleFieldBlur("address")} />
        </Form.Item>
        <Form.Item
          label={t("phoneNumber")}
          name="phoneNumber"
          rules={[
            { required: true, message: t("pleaseEnterPhoneNumber") },
            { len: 10, message: t("phoneNumberLength") },
          ]}
        >
          <Input
            type="text"
            maxLength={10}
            onChange={handlePhoneNumberChange}
            onBlur={() => handleFieldBlur("phoneNumber")}
          />
        </Form.Item>
        <Form.Item
          label={t("skills")}
          name="skills"
          rules={[{ required: true, message: t("pleaseSelectSkills") }]}
        >
          <Select
            mode="multiple"
            placeholder={t("selectSkills")}
            style={{ width: "100%" }}
            onBlur={() => handleFieldBlur("skills")}
          >
            {skillOptions.map((skill) => (
              <Option key={skill.value} value={skill.value}>
                {skill.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={t("status")}
          name="status"
          rules={[{ required: true, message: t("pleaseSelectStatus") }]}
        >
          <Select
            placeholder={t("selectStatus")}
            onBlur={() => handleFieldBlur("status")}
          >
            <Option value="active">{t("active")}</Option>
            <Option value="inactive">{t("inactive")}</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={t("department")}
          name="department"
          rules={[{ required: true, message: t("pleaseSelectDepartment") }]}
        >
          <Select
            placeholder={t("selectDepartment")}
            style={{ width: "100%" }}
            onBlur={() => handleFieldBlur("department")}
          >
            {departmentOptions.map((dept) => (
              <Option key={dept.value} value={dept.value}>
                {dept.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Position" name="position">
          <Select
            placeholder="Select position"
            onBlur={() => handleFieldBlur("position")}
          >
            {positions.map((pos) => (
              <Option key={pos.value} value={pos.value}>
                {pos.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={t("images")}>
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
                alt={`preview-${index}`}
                style={{ width: "100px", height: "100px", margin: "5px" }}
              />
            ))}
          </div>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t("submit")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddEmployee;