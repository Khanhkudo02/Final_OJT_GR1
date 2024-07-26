import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Checkbox, DatePicker, InputNumber, message, Upload } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAllProjects, putUpdateProject } from "../service/Project";
import { UploadOutlined } from '@ant-design/icons';
import moment from "moment";

const { Option } = Select;
const { TextArea } = Input;

const ProjectEdit = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      const allProjects = await fetchAllProjects();
      const projectData = allProjects.find(project => project.key === id);
      setProject(projectData);
      form.setFieldsValue({
        ...projectData,
        startDate: moment(projectData.startDate),
        endDate: moment(projectData.endDate),
      });
    };
    fetchProject();
  }, [id, form]);

  const onFinish = async (values) => {
    try {
      const projectData = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
        imageUrl: project.imageUrl,
      };
      await putUpdateProject(id, projectData, imageFile);
      message.success('Project updated successfully');
      navigate(`/project/${id}`);
    } catch (error) {
      message.error('Failed to update project');
    }
  };

  const handleImageChange = (info) => {
    setImageFile(info.file.originFileObj);
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        padding: "24px",
        background: "#fff",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
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
          label="Project ID"
          name="id"
          rules={[{ required: true, message: "Please input the project ID!" }]}
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
          <DatePicker />
        </Form.Item>

        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ required: true, message: "Please select the end date!" }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          label="Client Name"
          name="clientName"
          rules={[{ required: true, message: "Please input the client name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Client Contact"
          name="clientContact"
          rules={[
            {
              required: true,
              message: "Please input the client contact information!",
            },
          ]}
        >
          <Input />
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
          <TextArea rows={2} />
        </Form.Item>

        <Form.Item
          label="Budget"
          name="budget"
          rules={[
            { required: true, message: "Please input the project budget!" },
          ]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
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
          <Select>
            <Option value="WEB DESIGN">Web Design</Option>
            <Option value="MOBILE APP">Mobile App Development</Option>
            <Option value="UI/UX">UI/UX</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Technologies Used" name="technologies">
          <TextArea rows={2} />
        </Form.Item>

        <Form.Item label="Attachments" name="attachments">
          <Upload beforeUpload={() => false} onChange={handleImageChange}>
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
