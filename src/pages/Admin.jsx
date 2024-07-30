import { Button, Form, Input, message, Modal, Select, Space, Table } from "antd";
import bcrypt from "bcryptjs";
import { get, getDatabase, ref, remove, set, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ExportExcel from "../Components/ExportExcel";
import LanguageSwitcher from "../Components/LanguageSwitcher";
import "../assets/style/Global.scss";
import "../assets/style/Pages/Admin.scss";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

function AdminPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState("active");
  const [editUserId, setEditUserId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const db = getDatabase();
        const userRef = ref(db, "users");
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        if (userData) {
          const usersArray = Object.entries(userData).map(([id, data]) => ({
            id,
            ...data,
          }));
          usersArray.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          setUsers(usersArray);
        }
      } catch (error) {
        message.error(t("errorFetchingUsers"));
      }
    };

    fetchUsers();
  }, [t]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.role !== "admin") {
      navigate("/employee");
    }
  }, [navigate]);

  const handleAddOrUpdateUser = async (values) => {
    const { email, password, role, name, status } = values;

    if (!email || !name) {
      message.error(t("pleaseFillAllFields"));
      return;
    }

    if (!validateEmail(email)) {
      message.error(t("invalidEmailFormat"));
      return;
    }

    if (!editMode && password.length < 6) {
      message.error(t("passwordMinLength"));
      return;
    }

    try {
      const db = getDatabase();
      const snapshot = await get(ref(db, "users"));
      const usersData = snapshot.val();

      if (!editMode && usersData) {
        const emailExists = Object.values(usersData).some(
          (user) => user.email === email
        );
        if (emailExists) {
          message.error(t("emailAlreadyExists"));
          return;
        }
      }

      const userRef = ref(db, `users/${editUserId || uuidv4()}`);
      let userData = {
        email,
        name,
        contact: "",
        cv_list: [
          {
            title: "",
            description: "",
            file: "",
            updatedAt: new Date().toISOString(),
          },
        ],
        role,
        createdAt: new Date().toISOString(),
        projetcIds: "",
        skill: "",
        status: editMode ? status : "active",
      };

      if (editMode) {
        const currentUser = usersData[editUserId];
        if (currentUser.isAdmin && role !== currentUser.role) {
          message.error(t("cannotChangeAdminRole"));
          return;
        }

        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          userData.password = hashedPassword;
        }
        await update(userRef, userData);
        message.success(t("userUpdatedSuccessfully"));
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        userData.password = hashedPassword;

        const adminUsers = Object.values(usersData).filter(
          (user) => user.role === "admin"
        );

        if (role === "admin" && adminUsers.length === 0) {
          userData.isAdmin = true;
        }

        await set(userRef, userData);
        message.success(t("userAddedSuccessfully"));
      }

      form.resetFields();
      setEmail("");
      setPassword("");
      setName("");
      setRole("employee");
      setStatus("active");
      setEditMode(false);
      setEditUserId("");
      setModalVisible(false);

      const updatedSnapshot = await get(ref(db, "users"));
      const updatedUserData = updatedSnapshot.val();
      if (updatedUserData) {
        const usersArray = Object.entries(updatedUserData).map(
          ([id, data]) => ({
            id,
            ...data,
          })
        );
        setUsers(usersArray);
      }
    } catch (error) {
      message.error(t("errorAddingOrUpdatingUser"));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) {
      message.error(t("cannotDeleteAccount"));
      return;
    }

    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      if (userData) {
        if (userData.isAdmin) {
          message.error(t("cannotDeleteAdminUser"));
          return;
        }
        const adminUsers = users.filter((user) => user.role === "admin");

        if (userData.role === "admin" && adminUsers.length === 1) {
          message.error(t("cannotDeleteOnlyAdminUser"));
          return;
        }
        if (userData.status !== "inactive") {
          message.error(t("onlyInactiveUsersCanBeDeleted"));
          return;
        }

        await remove(userRef);
        message.success(t("userDeletedSuccessfully"));

        const updatedSnapshot = await get(ref(db, "users"));
        const updatedUserData = updatedSnapshot.val();
        if (updatedUserData) {
          const usersArray = Object.entries(updatedUserData).map(
            ([id, data]) => ({
              id,
              ...data,
            })
          );
          setUsers(usersArray);
        } else {
          setUsers([]);
        }
      } else {
        message.error(t("cannotDeleteAccount"));
      }
    } catch (error) {
      message.error(t("errorDeletingUser"));
    }
  };

  const handleEditUser = (user) => {
    setEmail(user.email);
    setPassword(user.password);
    setName(user.name);
    setRole(user.role);
    setStatus(user.status);
    setEditMode(true);
    setEditUserId(user.id);
    setModalVisible(true);
    form.setFieldsValue({
      email: user.email,
      password: user.password,
      name: user.name,
      role: user.role,
      status: user.status,
    });
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditMode(false);
    setEmail("");
    setPassword("");
    setName("");
    setRole("employee");
    setStatus("active");
    setEditUserId("");
    form.resetFields();
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const columns = [
    {
      title: t("email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("role"),
      dataIndex: "role",
      key: "role",
      render: (text) =>
        text ? text.charAt(0).toUpperCase() + text.slice(1) : "",
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (text) => {
        const className =
          text === "active" ? "status-active" : "status-inactive";
        return (
          <span className={className}>
            {text ? text.charAt(0).toUpperCase() + text.slice(1) : ""}
          </span>
        );
      },
    },
    {
      title: t("createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: t("actions"),
      key: "actions",
      render: (_, record) => (
        <Space key={record.id}>
          <Button 
            icon={<EditOutlined />} 
            style={{ color: "blue", borderColor: "blue" }} 
            onClick={() => handleEditUser(record)}
          />
          <Button 
            icon={<DeleteOutlined />} 
            style={{ color: "red", borderColor: "red" }} 
            onClick={() => handleDeleteUser(record.id)}
          />
          {/* Đã loại bỏ nút reset mật khẩu */}
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-page-container">
      <LanguageSwitcher />
      <h1>{t("adminPage")}</h1>
      <div className="admin-actions">
        <Button
          className="btn"
          type="primary"
          onClick={() => setModalVisible(true)}
        >
          {t("addUser")}
        </Button>
        <ExportExcel data={users} fileName="File Excel" />
      </div>
      <Modal
        title={editMode ? t("editUser") : t("addUser")}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleAddOrUpdateUser}
          initialValues={{ email, role, name }} // Không đưa mật khẩu vào initialValues
          layout="vertical"
          className="modal-form"
        >
          <Form.Item
            label={t("email")}
            name="email"
            rules={[{ required: true, message: t("emailRequired") }]}
          >
            <Input disabled={editMode} />
          </Form.Item>
          {!editMode && (
            <Form.Item
              label={t("password")}
              name="password"
              rules={[{ required: true, message: t("passwordRequired") }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item
            label={t("name")}
            name="name"
            rules={[{ required: true, message: t("nameRequired") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t("role")}
            name="role"
            rules={[{ required: true, message: t("roleRequired") }]}
          >
            <Select>
              <Option value="admin">{t("admin")}</Option>
              <Option value="employee">{t("employee")}</Option>
            </Select>
          </Form.Item>
          {editMode && (
            <Form.Item
              label={t("status")}
              name="status"
              rules={[{ required: true, message: t("statusRequired") }]}
            >
              <Select>
                <Option value="active">{t("active")}</Option>
                <Option value="inactive">{t("inactive")}</Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editMode ? t("updateUser") : t("addUser")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={users}
        columns={columns}
        rowKey={(record) => record.id}
        className="user-table"
      />
    </div>
  );
}

export default AdminPage;
