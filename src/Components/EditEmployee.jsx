import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Select, Upload } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchEmployeeById,
  putUpdateEmployee,
} from "../service/EmployeeServices";

const { Option } = Select;

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [oldImageUrl, setOldImageUrl] = useState("");
  
  // Các tùy chọn được chuyển ngữ
  const departmentOptions = [
    { value: "accounting", label: t("departmentAccounting") },
    { value: "audit", label: t("departmentAudit") },
    { value: "sales", label: t("departmentSales") },
    { value: "administration", label: t("departmentAdministration") },
    { value: "human_resources", label: t("departmentHumanResources") },
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

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const employee = await fetchEmployeeById(id);
        if (employee) {
          form.setFieldsValue({
            name: employee.name || "",
            email: employee.email || "",
            department: employee.department || [],
            status: employee.status || "",
            dateOfBirth: employee.dateOfBirth ? moment(employee.dateOfBirth) : "",
            address: employee.address || "",
            phoneNumber: employee.phoneNumber || "",
            skills: employee.skills || [],
          });

          setOldImageUrl(employee.imageUrl || ""); 

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
          message.error(t("employeeNotFound"));
        }
      } catch (error) {
        message.error(t("failedToFetchEmployee"));
      }
    };

    loadEmployee();
  }, [id, form, t]);

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      form.setFieldsValue({ phoneNumber: value });
    }
  };

  const handleUpdateEmployee = async (values) => {
    try {
      await putUpdateEmployee(
        id,
        values.name,
        values.email,
        values.dateOfBirth.format("YYYY-MM-DD"),
        values.address,
        values.phoneNumber,
        values.skills,
        values.status,
        values.department,
        fileList.length > 0 ? fileList[0].originFileObj : null,
        oldImageUrl 
      );
      message.success(t("employeeUpdatedSuccessfully"));
      navigate("/employee-management");
    } catch (error) {
      message.error(t("failedToUpdateEmployee"));
      console.error("Error details:", error);
    }
  };

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const beforeUpload = (file) => {
    handleImageChange({ fileList: [file] });
    return false; 
  };

  return (
    <Form
      form={form}
      onFinish={handleUpdateEmployee}
      layout="vertical"
      initialValues={{
        department: [],
        skills: [],
      }}
    >
      <h2>{t("editEmployee")}</h2>

      <Form.Item
        label={t("name")}
        name="name"
        rules={[{ required: true, message: t("nameRequired") }]}
      >
        <Input placeholder={t("name")} />
      </Form.Item>

      <Form.Item
        label={t("email")}
        name="email"
        rules={[{ type: 'email', message: t("invalidEmail") }, { required: true, message: t("emailRequired") }]}
      >
        <Input placeholder={t("email")} disabled />
      </Form.Item>

      <Form.Item
        label={t("department")}
        name="department"
        rules={[{ required: true, message: t("departmentRequired") }]}
      >
        <Select
          placeholder={t("department")}
          mode="multiple"
        >
          {departmentOptions.map((dept) => (
            <Option key={dept.value} value={dept.value}>
              {dept.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={t("status")}
        name="status"
        rules={[{ required: true, message: t("statusRequired") }]}
      >
        <Select placeholder={t("status")}>
          <Option value="active">{t("active")}</Option>
          <Option value="inactive">{t("inactive")}</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label={t("dateOfBirth")}
        name="dateOfBirth"
        rules={[{ required: true, message: t("dateOfBirthRequired") }]}
      >
        <Input type="date" />
      </Form.Item>

      <Form.Item
        label={t("address")}
        name="address"
        rules={[{ required: true, message: t("addressRequired") }]}
      >
        <Input placeholder={t("address")} />
      </Form.Item>

      <Form.Item
        label={t("phoneNumber")}
        name="phoneNumber"
        rules={[
          { required: true, message: t("phoneNumberRequired") },
          { pattern: /^\d{10}$/, message: t("phoneNumberInvalid") }
        ]}
      >
        <Input
          placeholder={t("phoneNumber")}
          maxLength={10}
          onChange={handlePhoneNumberChange}
        />
      </Form.Item>

      <Form.Item
        label={t("skills")}
        name="skills"
        rules={[{ required: true, message: t("skillsRequired") }]}
      >
        <Select
          mode="multiple"
          placeholder={t("skills")}
        >
          {skillOptions.map((skill) => (
            <Option key={skill.value} value={skill.value}>
              {skill.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Upload
          accept=".jpg,.jpeg,.png"
          beforeUpload={beforeUpload}
          fileList={fileList}
          onChange={handleImageChange}
          listType="picture"
          showUploadList={false}
        >
          <Button type="primary" icon={<PlusOutlined />}>{t("uploadImageButton")}</Button>
        </Upload>
        {fileList.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <img src={fileList[0].url} alt={t("imagePreview")} width="30%" />
          </div>
        )}
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {t("save")}
        </Button>
        <Button
          style={{ marginLeft: 8 }}
          onClick={() => navigate("/employee-management")}
        >
          {t("backToEmployeeManagement")}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditEmployee;
