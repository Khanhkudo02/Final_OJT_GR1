import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Space, Table, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../assets/style/Global.scss";
import "../assets/style/Pages/LanguageManagement.scss";
import { deleteLanguageById, fetchAllLanguages } from "../service/LanguageServices";
import { useTranslation } from "react-i18next";

const { Column } = Table;
const { confirm } = Modal;
const { TabPane } = Tabs;

const LanguageManagement = () => {
  const [languages, setLanguages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [dataLanguageEdit, setDataLanguageEdit] = useState(null);
  const [filteredStatus, setFilteredStatus] = useState("All Languages");
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();

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
      localStorage.removeItem("languageAdded");
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

  const handleTabChange = (key) => {
    setFilteredStatus(key);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const filteredData = languages.filter((item) => {
    const matchesStatus = filteredStatus === "All Languages" || item.status.toLowerCase() === filteredStatus.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <Button className="btn" type="primary" style={{ marginBottom: 16 }} onClick={showAddPage} icon={<PlusOutlined />}>
      </Button>
      <Input
        placeholder={t("search")}
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ width: "250px"}}
        prefix={<SearchOutlined />}
      />
      <Tabs
        defaultActiveKey="All Languages"
        onChange={handleTabChange}
        centered
      >
        <TabPane tab="All Languages" key="All Languages" />
        <TabPane tab="Active" key="active" />
        <TabPane tab="Inactive" key="inactive" />
      </Tabs>
      <Table
        dataSource={paginatedData}
        rowKey="key"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredData.length,
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
    </div>
  );
};

export default LanguageManagement;
