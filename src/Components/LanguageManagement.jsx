import React, { useState, useEffect } from 'react';
import { Button, Table, message, Modal } from 'antd';
import { fetchAllLanguages, deleteLanguageById } from "../service/LanguageServices";
import { useNavigate } from "react-router-dom";
import "../assets/style/Pages/LanguageManagement.scss";
import "../assets/style/Global.scss";

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
      <Button type="primary" style={{ marginBottom: 16 }} onClick={showAddPage}>
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
        <Column title="Status" dataIndex="status" key="status" />
        <Column
          title="Actions"
          key="actions"
          render={(text, record) => (
            <span>
              <Button
                type="primary"
                onClick={() => navigate(`/programing-language/view/${record.key}`)}
              >
                Detail
              </Button>
              <Button
                type="primary"
                onClick={() => navigate(`/programing-language/edit/${record.key}`)}
                style={{ marginLeft: 8 }}
              >
                Edit
              </Button>
              <Button
                type="danger"
                onClick={() => handleDelete(record)}
                style={{ marginLeft: 8 }}
              >
                Delete
              </Button>
            </span>
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
