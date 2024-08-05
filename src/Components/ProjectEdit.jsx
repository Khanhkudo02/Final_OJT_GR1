import { ArrowLeftOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Upload,
} from "antd";
import emailjs from "emailjs-com";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAllEmployees } from "../service/EmployeeServices";
import { fetchAllLanguages } from "../service/LanguageServices";
import { fetchAllProjects, putUpdateProject } from "../service/Project";
import { fetchAllTechnology } from "../service/TechnologyServices";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const { TextArea } = Input;

const ProjectEdit = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const allProjects = await fetchAllProjects();
        const projectData = allProjects.find((project) => project.key === id);
        if (projectData) {
          setProject(projectData);
          form.setFieldsValue({
            ...projectData,
            startDate: moment(projectData.startDate),
            endDate: moment(projectData.endDate),
          });

          // Set fileList for existing attachments
          if (projectData.imageUrl) {
            setFileList([
              {
                uid: "-1",
                name: "attachment",
                status: "done",
                url: projectData.imageUrl,
              },
            ]);
          }

          updateStatusOptions(projectData.status);
        } else {
          message.error("Project not found");
          navigate("/project-management");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        message.error("Error fetching project data");
        navigate("/project-management");
      }
    };
    fetchProject();
  }, [id, form, navigate]);

  // Load technologies
  useEffect(() => {
    const loadTechnologies = async () => {
      try {
        const data = await fetchAllTechnology();
        const techOptions = data.map((tech) => ({
          label: tech.name,
          value: tech.id, // Use key as value for Option
        }));
        setTechnologies(techOptions);
      } catch (err) {
        setError("Failed to fetch technologies");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTechnologies();
  }, []);

  // Load languages
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const data = await fetchAllLanguages();
        const languageOptions = data.map((lang) => ({
          label: lang.name,
          value: lang.name, // Sử dụng name làm giá trị cho Option
        }));
        setLanguages(languageOptions);
      } catch (err) {
        setError("Failed to fetch languages");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLanguages();
  }, []);

  // Load employees
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchAllEmployees();
        const employeeOptions = data
          .filter((emp) => emp.role === "employee")
          .map((emp) => ({
            label: emp.name,
            value: emp.name, // Sử dụng name làm giá trị cho Option
            email: emp.email,
          }));
        setEmployees(employeeOptions);
      } catch (err) {
        setError("Failed to fetch employees");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, []);

  const formatBudget = (value) => {
    let numericValue = value.replace(/[^\d$VND]/g, "");
    const hasDollarSign = numericValue.startsWith("$");
    const hasVND = numericValue.endsWith("VND");

    if (hasDollarSign) {
      numericValue = numericValue.slice(1);
    }
    if (hasVND) {
      numericValue = numericValue.slice(0, -3);
    }

    numericValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (hasDollarSign) {
      numericValue = `$${numericValue}`;
    }
    if (hasVND) {
      numericValue = `${numericValue}VND`;
    }

    return numericValue;
  };

  const handleBudgetChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatBudget(value);
    form.setFieldsValue({ budget: formattedValue });
  };

  const handleBudgetBlur = async () => {
    const value = form.getFieldValue("budget");
    if (!value.includes("$") && !value.includes("VND")) {
      message.error("Budget must include either $ or VND");
    }
  };

  const updateStatusOptions = (currentStatus) => {
    let options = [];
    switch (currentStatus) {
      case "ONGOING":
        options = ["PENDING", "COMPLETED"];
        break;
      case "PENDING":
        options = ["ONGOING"];
        break;
      case "COMPLETED":
        options = ["ONGOING"];
        break;
      case "NOT STARTED":
        options = ["ONGOING", "PENDING"];
        break;
      default:
        options = ["NOT STARTED", "ONGOING", "COMPLETED", "PENDING"];
        break;
    }
    setStatusOptions(options);
  };

  const sendNotificationEmail = (memberEmail, projectName, action) => {
    const templateParams = {
      user_email: memberEmail,
      projectName: projectName,
      action: action, // Thêm hành động (added/removed)
    };

    emailjs
      .send(
        "service_38z8rf8", // ID dịch vụ
        "template_bcwpepg", // ID mẫu
        templateParams,
        "BLOiZZ22_oSBTDilA" // User ID
      )
      .then((response) => {
        console.log("Email sent successfully:", response.status, response.text);
      })
      .catch((err) => {
        console.error("Failed to send email:", err);
      });
  };

  const onFinish = async (values) => {
    Modal.confirm({
      title: "Confirm Changes",
      content: "Do you agree with the changes you have made?",
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          const projectData = {
            ...values,
            startDate: values.startDate.format("YYYY-MM-DD"),
            endDate: values.endDate.format("YYYY-MM-DD"),
            imageUrl:
              fileList.length > 0 ? fileList[0].url : project.imageUrl || null, // Ensure imageUrl is not undefined
          };
          await putUpdateProject(
            id,
            projectData,
            fileList.length > 0 ? fileList[0].originFileObj : null
          );

          message.success("Project updated successfully");
          // Xác định các thành viên mới và cũ
          const currentTeamMembers = values.teamMembers || [];
          const previousTeamMembers = project.teamMembers || [];

          const addedMembers = currentTeamMembers.filter(
            (member) => !previousTeamMembers.includes(member)
          );
          const removedMembers = previousTeamMembers.filter(
            (member) => !currentTeamMembers.includes(member)
          );

          // Gửi email thông báo cho các thành viên mới
          for (const member of addedMembers) {
            const memberData = employees.find((emp) => emp.value === member);
            if (memberData) {
              sendNotificationEmail(memberData.email, values.name, "added");
            }
          }

          // Gửi email thông báo cho các thành viên bị xóa
          for (const member of removedMembers) {
            const memberData = employees.find((emp) => emp.value === member);
            if (memberData) {
              sendNotificationEmail(memberData.email, values.name, "removed");
            }
          }

          navigate(`/project/${id}`);
        } catch (error) {
          message.error("Failed to update project");
        }
      },
    });
  };

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        padding: "24px 0",
        background: "#fff",
        maxWidth: "1000px",
        margin: "auto",
      }}
    >
      <Button
        type="default"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(`/project/${id}`)}
      >
        {t("Back")}
      </Button>
      <h2>{t("EditProject")}</h2>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label={t("ProjectName")}
          name="name"
          rules={[
            { required: true, message: "Please input the project name!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t("Description")}
          name="description"
          rules={[
            {
              required: true,
              message: "Please input the project description!",
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label={t("StartDate")}
          name="startDate"
          rules={[{ required: true, message: "Please select the start date!" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label={t("EndDate")}
          name="endDate"
          rules={[{ required: true, message: "Please select the end date!" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label={t("name")}
          name="clientName"
          rules={[{ required: true, message: "Please input the client name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t("Email")}
          name="email"
          rules={[
            { required: true, message: "Please input the client email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="emailname@gmail.com" />
        </Form.Item>

        <Form.Item
          label={t("phoneNumber")}
          name="phoneNumber"
          rules={[
            { required: true, message: "Please input the phone number!" },
            {
              pattern: /^[0-9]{10}$/,
              message: "Please enter a valid 10-digit phone number!",
            },
          ]}
        >
          <Input placeholder="0123456789" />
        </Form.Item>

        <Form.Item
          label={t("ProjectManager")}
          name="projectManager"
          rules={[
            { required: true, message: "Please input the project manager!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t("TeamMember")}
          name="teamMembers"
          rules={[
            { required: true, message: "Please select the team members!" },
          ]}
        >
          <Select mode="multiple" placeholder="Select team members">
            {employees.map((emp) => (
              <Option key={emp.value} value={emp.value}>
                {emp.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={t("Budget")}
          name="budget"
          rules={[
            { required: true, message: "Please input the project budget!" },
          ]}
        >
          <Input
            onBlur={handleBudgetBlur}
            onChange={handleBudgetChange}
            maxLength={20}
          />
        </Form.Item>

        <Form.Item
          label={t("Status")}
          name="status"
          rules={[
            { required: true, message: "Please select the project status!" },
          ]}
        >
          <Select>
            {statusOptions.map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={t("Priority")}
          name="priority"
          rules={[
            { required: true, message: "Please select the project priority!" },
          ]}
        >
          <Select>
            <Option value="HIGH">High</Option>
            <Option value="MEDIUM">Medium</Option>
            <Option value="LOW">Low</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={t("Category")}
          name="category"
          rules={[
            { required: true, message: "Please select the project category!" },
          ]}
        >
          <Select mode="multiple" placeholder="Select categories">
            <Option value="WEB DESIGN">Web Design</Option>
            <Option value="MOBILE APP">Mobile App Development</Option>
            <Option value="UI/UX">UI/UX</Option>
          </Select>
        </Form.Item>

        {/* Select technologies */}
        <Form.Item label={t("TechnologiesUsed")} name="technologies">
          <Select mode="multiple" placeholder="Select technologies">
            {technologies.map((tech) => (
              <Option key={tech.value} value={tech.value}>
                {tech.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Select programming languages */}
        <Form.Item label={t("ProgrammingLanguageUsed")} name="languages">
          <Select mode="multiple" placeholder="Select languages">
            {languages.map((lang) => (
              <Option key={lang.value} value={lang.value}>
                {lang.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label={t("Attachments")} name="attachments">
          <Upload
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleImageChange}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>{t("Click to Upload")}</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t("update")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProjectEdit;
