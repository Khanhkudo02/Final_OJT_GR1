import React, { useState, useEffect } from 'react';
import { Button, Table, message, Modal, Space } from 'antd';
import { fetchAllLanguages, deleteLanguageById } from "../service/LanguageServices";
import { useNavigate } from "react-router-dom";
import "../assets/style/Pages/LanguageManagement.scss";
import "../assets/style/Global.scss";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Column } = Table;
const { confirm } = Modal;

const LanguageManagement = () => {
  const [languages, setLanguages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [dataLanguageEdit, setDataLanguageEdit] = useState(null);

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

    const languageAdded = localStorage.getItem("languageAdded");
    if (languageAdded === "true") {
      message.success("Language added successfully!");
      localStorage.removeItem("languageAdded"); // Remove notification after display
    }
  }, []);

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const showEditModal = (record) => {
    setDataLanguageEdit(record);
    setIsEditModalVisible(true);
  };

  const showAddPage = () => {
    navigate("/programing-language/add");
  };

  const handleDelete = (record) => {
    if (record.status !== 'inactive') {
      message.error('Only inactive languages can be deleted.');
      return;
    }

    confirm({
      title: 'Are you sure you want to delete this language?',
      onOk: async () => {
        try {
          await deleteLanguageById(record.key);
          message.success('Language deleted successfully!');
          loadLanguages();
        } catch (error) {
          message.error('Failed to delete language.');
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const paginatedData = languages.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <Button className="btn" type="primary" style={{ marginBottom: 16 }} onClick={showAddPage}>
        Add New Language
      </Button>
      <Table
        dataSource={paginatedData}
        rowKey="key"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: languages.length,
          onChange: (page, pageSize) =>
            handleTableChange({ current: page, pageSize }),
        }}
      >
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
            <Space>
              <Button 
                icon={<EyeOutlined />} 
                style={{ color: "green", borderColor: "green" }} 
                onClick={() => navigate(`/programing-language/view/${record.key}`)}
              />
              <Button 
                icon={<EditOutlined />} 
                style={{ color: "blue", borderColor: "blue" }} 
                onClick={() => navigate(`/programing-language/edit/${record.key}`)}
              />
              <Button 
                icon={<DeleteOutlined />} 
                style={{ color: "red", borderColor: "red" }} 
                onClick={() => handleDelete(record)}
              />
            </Space>
          )}
        />
      </Table>
      {dataLanguageEdit && (
        <ModalEditLanguage
          open={isEditModalVisible}
          handleClose={() => setIsEditModalVisible(false)}
          dataLanguageEdit={dataLanguageEdit}
        />
      )}
    </div>
  );
};

export default LanguageManagement;
