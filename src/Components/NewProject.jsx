import React, { useState } from "react";
import { Form, Input, Button, Select, Checkbox, DatePicker, InputNumber, message, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import { postCreateProject } from "../service/Project";
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const NewProject = () => {
  const [form] = Form.useForm();
  const [agreement, setAgreement] = useState(false);
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);

  const onFinish = async (values) => {
    try {
      const projectData = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD')
      };
      await postCreateProject(projectData, imageFile);
      message.success('Project added successfully');
      navigate('/project-management');
    } catch (error) {
      message.error('Failed to add project');
    }
  };

  const handleAgreementChange = (e) => {
    setAgreement(e.target.checked);
  };

  const handleImageChange = (info) => {
    setImageFile(info.file.originFileObj);
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "#fff",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h2>New Project</h2>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="Project Name"
          name="projectName"
          rules={[
            { required: true, message: "Please input the project name!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Project ID"
          name="projectID"
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
            <Option value="not started">Not Started</Option>
            <Option value="ongoing">Ongoing</Option>
            <Option value="completed">Completed</Option>
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
            <Option value="high">High</Option>
            <Option value="medium">Medium</Option>
            <Option value="low">Low</Option>
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
            <Option value="web design">Web Design</Option>
            <Option value="mobile app">Mobile App Development</Option>
            <Option value="uiux">UI/UX</Option>
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
          <Checkbox checked={agreement} onChange={handleAgreementChange}>
            I have read the agreement
          </Checkbox>
          {!agreement && (
            <div style={{ color: "red" }}>Should accept agreement</div>
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={!agreement}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewProject;
