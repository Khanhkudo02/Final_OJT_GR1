import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, Select, Upload, Modal, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  fetchTechnologyById,
  putUpdateTechnology,
} from "../service/TechnologyServices";
import { storage } from "../firebaseConfig";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const { Option } = Select;

const EditTechnology = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [initialImageUrl, setInitialImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadTechnology = async () => {
      try {
        console.log("Fetching technology with ID:", id);
        const data = await fetchTechnologyById(id);
        form.setFieldsValue({
          name: data.name,
          description: data.description,
          status: data.status,
        });
        setInitialImageUrl(data.imageUrl || "");
      } catch (error) {
        message.error("Failed to fetch technology data.");
        console.error("Failed to fetch technology by ID:", error);
      }
    };

    loadTechnology();
  }, [id, form]);

  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      setImageFile(fileList[fileList.length - 1].originFileObj);
    } else {
      setImageFile(null);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      let imageUrl = initialImageUrl;
      if (imageFile) {
        const storageReference = storageRef(
          storage,
          `technologies/${Date.now()}_${imageFile.name}`
        );
        await uploadBytes(storageReference, imageFile);
        imageUrl = await getDownloadURL(storageReference);
        console.log("Image URL:", imageUrl);
      }

      await putUpdateTechnology(
        id,
        values.name,
        values.description,
        values.status,
        imageUrl
      );

      Modal.success({
        content: "Technology updated successfully!",
        onOk: () => navigate("/technology-management"),
      });
    } catch (error) {
      message.error("Failed to update technology.");
      console.error("Failed to update technology:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-technology">
      <h2>Edit Technology</h2>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please input the technology name!" },
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
              message: "Please input the technology description!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[
            { required: true, message: "Please select the technology status!" },
          ]}
        >
          <Select>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Image" name="image">
          <Upload
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleImageChange}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
          {initialImageUrl && !fileList.length && (
            <img
              src={initialImageUrl}
              alt="Technology"
              style={{ width: "100px", marginTop: "10px" }}
            />
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => navigate("/technology-management")}
          >
            Back
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditTechnology;

