import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Space, Table, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteEmployeeById,
  fetchAllEmployees,
  postCreateEmployee,
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
    } = values;

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
      form.resetFields(); // Reset form fields after successful submission
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
          <Input type="text" />
        </Form.Item>
        <Form.Item
          label={t("email")}
          name="email"
          rules={[
            { required: true, message: t("pleaseEnterEmail") },
            { type: "email", message: t("invalidEmail") },
          ]}
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item
          label={t("password")}
          name="password"
          rules={[
            { required: true, message: t("pleaseEnterPassword") },
            { min: 6, message: t("passwordMinLength") },
          ]}
        >
          <Input type="password" />
        </Form.Item>
        <Form.Item
          label={t("dateOfBirth")}
          name="dateOfBirth"
          rules={[{ required: true, message: t("pleaseEnterDateOfBirth") }]}
        >
          <Input type="date" />
        </Form.Item>
        <Form.Item
          label={t("address")}
          name="address"
          rules={[{ required: true, message: t("pleaseEnterAddress") }]}
        >
          <Input type="text" />
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
          <Select placeholder={t("selectStatus")}>
            <Option value="active">{t("active")}</Option>
            <Option value="inactive">{t("inactive")}</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={t("department")}
          name="department"
          rules={[{ required: true, message: t("pleaseSelectDepartment") }]}
        >
          <Select placeholder={t("selectDepartment")} style={{ width: "100%" }}>
            {departmentOptions.map((dept) => (
              <Option key={dept.value} value={dept.value}>
                {dept.label}
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
      <Table dataSource={employees} rowKey="id" style={{ marginTop: "20px" }}>
        <Column title={t("name")} dataIndex="name" key="name" />
        <Column title={t("email")} dataIndex="email" key="email" />
        <Column
          title={t("phoneNumber")}
          dataIndex="phoneNumber"
          key="phoneNumber"
        />
        <Column
          title={t("skills")}
          dataIndex="skills"
          key="skills"
          render={(skills) => skills.map(getSkillLabel).join(", ")}
        />
        <Column
          title={t("department")}
          dataIndex="department"
          key="department"
          render={(dept) => {
            if (typeof dept === "string") {
              return t(
                `department${dept.charAt(0).toUpperCase() + dept.slice(1)}`
              );
            }
            return "";
          }}
        />
      </Table>
      <Modal
        title={t("employeeDetails")}
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
      >
        {selectedEmployee ? (
          <div>
            <p>
              <strong>{t("name")}:</strong> {selectedEmployee.name}
            </p>
            <p>
              <strong>{t("email")}:</strong> {selectedEmployee.email}
            </p>
            <p>
              <strong>{t("phoneNumber")}:</strong>{" "}
              {selectedEmployee.phoneNumber}
            </p>
            <p>
              <strong>{t("skills")}:</strong>{" "}
              {selectedEmployee.skills.map(getSkillLabel).join(", ")}
            </p>
            <p>
              <strong>{t("department")}:</strong>{" "}
              {t(
                `department${selectedEmployee.department.charAt(0).toUpperCase() +
                selectedEmployee.department.slice(1)
                }`
              )}
            </p>
            <p>
              <strong>{t("status")}:</strong>{" "}
              {selectedEmployee.status === "active"
                ? t("active")
                : t("inactive")}
            </p>
            <p>
              <strong>{t("address")}:</strong> {selectedEmployee.address}
            </p>
            <p>
              <strong>{t("dateOfBirth")}:</strong>{" "}
              {selectedEmployee.dateOfBirth}
            </p>
            <div className="image-previews">
              {selectedEmployee.images &&
                selectedEmployee.images.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`employee-${index}`}
                    style={{ width: "100px", height: "100px", margin: "5px" }}
                  />
                ))}
            </div>
          </div>
        ) : (
          <p>{t("employeeNotFound")}</p>
        )}
      </Modal>
    </div>
  );
};

export default AddEmployee;
