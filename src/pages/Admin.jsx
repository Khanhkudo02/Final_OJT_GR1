import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Modal, Select, Table } from "antd";
import { get, getDatabase, ref, remove, set, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../Components/LanguageSwitcher"; // Import LanguageSwitcher
import ExportExcel from "../Components/ExportExcel"; // Import ExportExcel

const { Option } = Select;

function AdminPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editUserEmail, setEditUserEmail] = useState("");
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
          // Convert userData object to an array
          const usersArray = Object.values(userData);

          // Sort users by createdAt in ascending order (oldest first)
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
    const { email, password, role, name } = values;

    if (!email || !password || !name) {
      message.error(t("pleaseFillAllFields"));
      return;
    }

    if (!validateEmail(email)) {
      message.error(t("invalidEmailFormat"));
      return;
    }

    if (password.length < 6) {
      message.error(t("passwordMinLength"));
      return;
    }

    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${email.replace(".", ",")}`);

      if (!editMode) {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          message.error(t("emailAlreadyExists"));
          return;
        }
      }
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
        Status: "",
      };

      if (editMode) {
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          userData.password = hashedPassword;
        }
        await update(userRef, userData);
        message.success(t("userUpdatedSuccessfully"));
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        userData.password = hashedPassword;

        const snapshot = await get(ref(db, "users"));
        const usersData = snapshot.val();
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
      setEditMode(false);
      setEditUserEmail("");

      // Fetch and update the user list
      const updatedSnapshot = await get(ref(db, "users"));
      const updatedUserData = updatedSnapshot.val();
      if (updatedUserData) {
        // Convert updatedUserData object to an array
        const usersArray = Object.values(updatedUserData);

        setUsers(usersArray); // No sorting here
      }
    } catch (error) {
      message.error(t("errorAddingOrUpdatingUser"));
    }
  };

  const handleDeleteUser = async (userEmail) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${userEmail.replace(".", ",")}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      const adminUsers = users.filter((user) => user.isAdmin);

      if (userData.isAdmin && adminUsers.length === 1) {
        message.error(t("cannotDeleteOnlyAdminUser"));
        return;
      }

      if (userData.isAdmin) {
        message.error(t("cannotDeleteAdminUser"));
        return;
      }

      await remove(userRef);
      message.success(t("userDeletedSuccessfully"));

      // Fetch and update the user list
      const updatedSnapshot = await get(ref(db, "users"));
      const updatedUserData = updatedSnapshot.val();
      if (updatedUserData) {
        // Convert updatedUserData object to an array
        const usersArray = Object.values(updatedUserData);

        // Sort users by createdAt in ascending order (oldest first)
        usersArray.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        setUsers(usersArray);
      } else {
        setUsers([]);
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
    setEditMode(true);
    setEditUserEmail(user.email);
    setModalVisible(true);
    form.setFieldsValue({
      email: user.email,
      password: user.password,
      name: user.name, // Set name for editing
      role: user.role,
    }); // Open modal for editing
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditMode(false);
    setEmail("");
    setPassword("");
    setName("");
    setRole("employee");
    setEditUserEmail("");
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
      title: t("Name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("role"),
      dataIndex: "role",
      key: "role",
    },
    {
      title: t("Created At"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: t("Actions"),
      key: "actions",
      render: (_, record) => (
        <div>
          <Button onClick={() => handleEditUser(record)}>{t("edit")}</Button>
          <Button onClick={() => handleDeleteUser(record.email)}>
            {t("delete")}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <LanguageSwitcher />
      <h1>{t("adminPage")}</h1>
      <Button type="primary" onClick={() => setModalVisible(true)}>
        {t("addUser")}
      </Button>
      <ExportExcel data={users} fileName="UsersData" />{" "}
      {/* Add ExportExcel component */}
      <Modal
        title={editMode ? t("editUser") : t("addUser")}
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleAddOrUpdateUser}
          initialValues={{ email, password, role, name }}
          layout="vertical"
        >
          <Form.Item
            label={t("email")}
            name="email"
            rules={[{ required: true, message: t("pleaseInputEmail") }]}
          >
            <Input
              disabled={editMode}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label={t("name")}
            name="name"
            rules={[{ required: true, message: t("pleaseInputName") }]}
          >
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Item>

          <Form.Item
            label={t("password")}
            name="password"
            rules={[
              { required: true, message: t("pleaseInputPassword") },
              { min: 6, message: t("passwordMinLength") },
            ]}
          >
            <Input.Password
              disabled={editMode}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item label={t("role")} name="role">
            <Select value={role} onChange={(value) => setRole(value)}>
              <Option value="employee">{t("employee")}</Option>
              <Option value="admin">{t("admin")}</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editMode ? t("updateUser") : t("addUser")}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table dataSource={users} columns={columns} rowKey="email" />
    </div>
  );
}

export default AdminPage;
