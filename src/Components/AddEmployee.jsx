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
  fetchAllPositions, // Import the function
} from "../service/EmployeeServices";

const { Option } = Select;
const { Column } = Table;

const AddEmployee = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState([]); // State for positions
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const navigate = useNavigate();

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
      );
      setEmployees(filteredData);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const loadPositions = async () => {
    try {
      const data = await fetchAllPositions();
      const activePositions = data.filter(position => position.status === 'active'); // Lọc trạng thái active
      setPositions(activePositions.map(position => ({ value: position.key, label: position.name })));
    } catch (error) {
      console.error("Failed to fetch positions:", error);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadPositions(); // Load positions when component mounts
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

    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        form.setFields([
          {
            name: "email",
            errors: [t("emailAlreadyExists")],
          },
        ]);
        return;
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
      loadEmployees();
    } catch (error) {
      toast.error(t("failedToDeleteEmployee"));
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length <= 10) {
      form.setFieldsValue({ phoneNumber: numericValue });
    }
  };

  const handleImageChange = (info) => {
    if (info.fileList) {
      setImageFiles(info.fileList.map((file) => file.originFileObj));

      const previewUrls = info.fileList.map((file) => {
        if (file.originFileObj) {
          return URL.createObjectURL(file.originFileObj);
        }
        return "";
      });
      setImagePreviews(previewUrls);
    }
    return false;
  };

  const handleFieldBlur = async (fieldName) => {
    try {
      await form.validateFields([fieldName]);
    } catch (error) {
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
            { pattern: /^[0-9]+$/, message: t("phoneNumberInvalid") },
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
          <Select mode="multiple" placeholder={t("selectSkills")}>
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
          <Select onBlur={() => handleFieldBlur("status")}>
            <Option value="active">{t("active")}</Option>
            <Option value="inactive">{t("inactive")}</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={t("department")}
          name="department"
          rules={[{ required: true, message: t("pleaseSelectDepartment") }]}
        >
          <Select onBlur={() => handleFieldBlur("department")}>
            <Option value="Accounting">{t("accounting")}</Option>
            <Option value="Audit">{t("audit")}</Option>
            <Option value="Sales">{t("sales")}</Option>
            <Option value="Administration">{t("administration")}</Option>
            <Option value="Human Resources">{t("humanResources")}</Option>
            <Option value="Customer Service">{t("customerService")}</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={t("position")}
          name="position"
          rules={[{ required: true, message: t("pleaseSelectPosition") }]}
        >
          <Select onBlur={() => handleFieldBlur("position")}>
            {positions.map((position) => (
              <Option key={position.value} value={position.value}>
                {position.label}
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
            {t("Add Employee")}
          </Button>
        </Form.Item>
      </Form>

      {/* Modal for viewing employee details */}
      <Modal
        title={t("employeeDetails")}
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
      >
        {selectedEmployee && (
          <div>
            <p>{t("name")}: {selectedEmployee.name}</p>
            <p>{t("email")}: {selectedEmployee.email}</p>
            <p>{t("position")}: {selectedEmployee.position}</p>
            {/* Add more fields as necessary */}
          </div>
        )}
      </Modal>

      {/* Table for displaying employees */}
      <Table dataSource={employees} rowKey="id">
        <Column title={t("name")} dataIndex="name" key="name" />
        <Column title={t("email")} dataIndex="email" key="email" />
        <Column title={t("phoneNumber")} dataIndex="phoneNumber" key="phoneNumber" />
        <Column title={t("status")} dataIndex="status" key="status" />
        <Column
          title={t("actions")}
          key="actions"
          render={(text, record) => (
            <Space size="middle">
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => handleViewEmployee(record)}
              >
                {t("view")}
              </Button>
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteEmployee(record.id)}
              >
                {t("delete")}
              </Button>
            </Space>
          )}
        />
      </Table>
    </div >
  );
};

export default AddEmployee;
