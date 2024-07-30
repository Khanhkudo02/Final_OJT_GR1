import React, { useState, useEffect } from "react";
import { Button, Input, Select, Table, Modal, Space } from "antd";
import {
  postCreateLanguage,
  fetchAllLanguages,
  deleteLanguageById,
} from "../service/LanguageServices";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../assets/style/Global.scss";

const { Option } = Select;
const { Column } = Table;

const AddLanguage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [languages, setLanguages] = useState([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const navigate = useNavigate();

  const loadLanguages = async () => {
    try {
      const data = await fetchAllLanguages();
      setLanguages(data);
    } catch (error) {
      console.error("Failed to fetch languages:", error);
    }
  };

  useEffect(() => {
    loadLanguages();
  }, []);

  const handleAddLanguage = async () => {
    if (!name || !description || !status) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await postCreateLanguage(name, description, status);
      localStorage.setItem("languageAdded", "true");
      navigate("/programing-language");
    } catch (error) {
      toast.error("Failed to add language.");
    }
  };

  const handleViewLanguage = (language) => {
    setSelectedLanguage(language);
    setViewModalVisible(true);
  };

  const handleDeleteLanguage = async (id) => {
    try {
      await deleteLanguageById(id);
      toast.success("Language deleted successfully!");
      loadLanguages(); // Reload the languages list
    } catch (error) {
      toast.error("Failed to delete language.");
    }
  };

  return (
    <div className="add-language">
      <h2>Add New Language</h2>
      <div className="form-group">
        <label>Name</label>
        <Input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <Input
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Status</label>
        <Select
          value={status}
          onChange={(value) => setStatus(value)}
          placeholder="Select Status"
        >
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
      </div>
      <Button
        type="primary"
        onClick={handleAddLanguage}
        disabled={!name || !description || !status}
      >
        Save
      </Button>
      <Button
        style={{ marginLeft: 8 }}
        onClick={() => navigate("/programing-language")}
      >
        Back to Language Management
      </Button>

      <h2>Existing Languages</h2>
      <Table dataSource={languages} rowKey="key" pagination={false}>
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column
          title="Status"
          dataIndex="status"
          key="status"
          render={(text) => {
            const className =
              text === "active" ? "status-active" : "status-inactive";
            return (
              <span className={className}>
                {text ? text.charAt(0).toUpperCase() + text.slice(1) : ""}
              </span>
            );
          }}
        />
        <Column
          title="Actions"
          key="actions"
          render={(text, record) => (
            // <div>
            //   <Button onClick={() => handleViewLanguage(record)}>View</Button>
            //   <Button
            //     onClick={() => handleDeleteLanguage(record.key)}
            //     disabled={record.status !== "inactive"}
            //     style={{ marginLeft: 8 }}
            //   >
            //     Delete
            //   </Button>
            // </div>
            <Space>
                <Button 
                icon={<EyeOutlined />} 
                style={{ color: "green", borderColor: "green" }} 
                onClick={() => handleViewLanguage(record)}
                />
                <Button 
                icon={<DeleteOutlined />} 
                style={{ color: "red", borderColor: "red" }} 
                onClick={() => handleDeleteLanguage(record.key)}
                />
          </Space>
          )}
        />
      </Table>
      <Modal
        title="View Language"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedLanguage && (
          <div>
            <p>
              <strong>Name:</strong> {selectedLanguage.name}
            </p>
            <p>
              <strong>Description:</strong> {selectedLanguage.description}
            </p>
            <p>
              <strong>Status:</strong> {selectedLanguage.status}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AddLanguage;