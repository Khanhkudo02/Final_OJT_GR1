import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  message,
  Upload,
  Modal,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAllProjects, putUpdateProject } from "../service/Project";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import moment from "moment";
import { fetchAllTechnology } from "../service/TechnologyServices";
import { fetchAllLanguages } from "../service/LanguageServices";
import { fetchAllPositions } from "../service/PositionServices";

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
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          value: tech.key, // Use key as value for Option
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
          value: lang.key, // Use key as value for Option
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

  // Load positions
  useEffect(() => {
    const loadPositions = async () => {
      try {
        const data = await fetchAllPositions();
        const positionOptions = data.map((pos) => ({
          label: pos.name,
          value: pos.key, // Use key as value for Option
        }));
        setPositions(positionOptions);
      } catch (err) {
        setError("Failed to fetch positions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPositions();
  }, []);

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
            imageUrl: fileList.length > 0 ? fileList[0].url : project.imageUrl || null,
          };
          await putUpdateProject(
            id,
            projectData,
            fileList.length > 0 ? fileList[0].originFileObj : null
          );
          message.success("Project updated successfully");
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

  const formatNumber = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const parseNumber = (value) => {
    return value.replace(/\D/g, "");
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
      <Button type="default" icon={<ArrowLeftOutlined />} onClick={() => navigate(`/project/${id}`)}>
        Back
      </Button>
      <h2>Edit Project</h2>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="Project Name"
          name="name"
          rules={[
            { required: true, message: "Please input the project name!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
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
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: "Please select the start date!" }]}
        >
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ required: true, message: "Please select the end date!" }]}
        >
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item
          label="Name"
          name="clientName"
          rules={[{ required: true, message: "Please input the client name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input the client email!" },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input placeholder="input placeholder" />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            { required: true, message: "Please input the phone number!" },
            { pattern: /^[0-9]+$/, message: 'Please enter a valid phone number!' }
          ]}
        >
          <Input placeholder="input placeholder" />
        </Form.Item>

        <Form.Item
          label="Project Manager"
          name="projectManager"
          rules={[
            { required: true, message: "Please input the project manager!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Team Members"
          name="teamMembers"
          rules={[{ required: true, message: "Please list the team members!" }]}
        >
          <Select mode="multiple" placeholder="Select team members">
            {positions.map((pos) => (
              <Option key={pos.value} value={pos.value}>
                {pos.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Budget"
          name="budget"
          rules={[
            { required: true, message: "Please input the project budget!" },
          ]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            formatter={formatNumber}
            parser={parseNumber}
          />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[
            { required: true, message: "Please select the project status!" },
          ]}
        >
          <Select>
            <Option value="NOT STARTED">Not Started</Option>
            <Option value="ONGOING">Ongoing</Option>
            <Option value="COMPLETED">Completed</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Priority"
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
          label="Category"
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
        <Form.Item label="Technologies Used" name="technologies">
          <Select mode="multiple" placeholder="Select technologies">
            {technologies.map((tech) => (
              <Option key={tech.value} value={tech.value}>
                {tech.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Select programming languages */}
        <Form.Item label="Programming Languages Used" name="languages">
          <Select mode="multiple" placeholder="Select languages">
            {languages.map((lang) => (
              <Option key={lang.value} value={lang.value}>
                {lang.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Attachments" name="attachments">
          <Upload
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleImageChange}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProjectEdit;
