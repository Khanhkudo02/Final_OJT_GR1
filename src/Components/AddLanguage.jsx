import React, { useState } from 'react';
import { Button, Form, Input, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { postCreateLanguage } from "../service/LanguageServices";
import { useNavigate } from "react-router-dom";

const AddLanguage = () => {
    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = ({ file }) => {
        setFile(file);
    };

    const onFinish = async (values) => {
        const { name, description, status } = values;
        try {
            await postCreateLanguage(name, description, status, file);
            message.success('Language added successfully!');
            localStorage.setItem("languageAdded", "true");
            navigate("/language-management");
        } catch (error) {
            message.error('Failed to add language.');
        }
    };

    return (
        <div className="add-language">
            <h2>Add New Language</h2>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: 'Please input the language name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please input the description!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: 'Please select the status!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="image"
                    label="Upload Image"
                >
                    <Upload
                        beforeUpload={() => false}
                        onChange={handleFileChange}
                    >
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Language
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddLanguage;
