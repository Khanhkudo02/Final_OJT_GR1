import {
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, message, Modal, Space, Table, Tabs } from "antd";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "../assets/style/Global.scss";
import "../assets/style/Pages/EmployeeManagement.scss";
import {
  deleteEmployeeById,
  fetchAllEmployees,
} from "../service/EmployeeServices";
import { get, getDatabase, ref, onValue } from "firebase/database";

const { Column } = Table;
const { confirm } = Modal;
const { TabPane } = Tabs;
const { Search } = Input;

const EmployeeManagement = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState(null);
  const [data, setData] = useState([]);

  const formatSkill = (skill) =>
    skill
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const formatDepartment = (department) => {
    if (typeof department === "string") {
      return department
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }
    return department;
  };

  const loadEmployees = async () => {
    try {
      const data = await fetchAllEmployees();
      const filteredData = data
        .filter((employee) => employee.role === "employee")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Lọc dữ liệu theo tab
      if (activeTab === "active") {
        setFilteredEmployees(filteredData.filter((e) => e.status === "active"));
      } else if (activeTab === "inactive") {
        setFilteredEmployees(
          filteredData.filter((e) => e.status === "inactive")
        );
      } else if (activeTab === "involved") {
        setFilteredEmployees(
          filteredData.filter((e) => e.status === "involved")
        );
      } else {
        setFilteredEmployees(filteredData); // Tab "All Employees"
      }
      setEmployees(filteredData);
    } catch (error) {
      console.error(t("errorFetchingEmployees"), error);
    }
  };

  useEffect(() => {
    loadEmployees();

    const employeeAdded = localStorage.getItem("employeeAdded");
    if (employeeAdded === "true") {
      message.success(t("employeeAddedSuccessfully"));
      localStorage.removeItem("employeeAdded");
    }
  }, [t, activeTab]);

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  useEffect(() => {
    // Filter employees based on search term
    const searchData = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply tab filter
    if (activeTab === "active") {
      setFilteredEmployees(searchData.filter((e) => e.status === "active"));
    } else if (activeTab === "inactive") {
      setFilteredEmployees(searchData.filter((e) => e.status === "inactive"));
    } else if (activeTab === "involved") {
      setFilteredEmployees(searchData.filter((e) => e.status === "involved"));
    } else {
      setFilteredEmployees(searchData); // Tab "All Employees"
    }
  }, [searchTerm, employees, activeTab]);

  const showAddPage = () => {
    navigate("/employee-management/add");
  };

  const handleDelete = (record) => {
    if (record.status !== "inactive") {
      message.error(t("onlyInactiveEmployeesCanBeDeleted"));
      return;
    }

    confirm({
      title: t("confirmDeleteEmployee"),
      onOk: async () => {
        try {
          await deleteEmployeeById(record.key);
          message.success(t("employeeDeletedSuccessfully"));
          loadEmployees();
        } catch (error) {
          message.error(t("failedToDeleteEmployee"));
        }
      },
      onCancel() {
        console.log(t("cancel"));
      },
    });
  };

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const db = getDatabase();
        const userRef = ref(db, `users/${userId}`);
        const snapshot = await get(userRef);
        const data = snapshot.val();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchProjects = async () => {
      const projectsRef = ref(getDatabase(), "projects");
      onValue(projectsRef, (snapshot) => {
        const projectsData = snapshot.val();
        const projectsList = [];
        for (const key in projectsData) {
          projectsList.push({ key, ...projectsData[key] });
        }
        const userProjects = projectsList.filter((project) =>
          project.teamMembers?.includes(userId)
        );
        setProjects(userProjects.reverse());
      });
    };

    if (userId) {
      fetchUserData();
      fetchProjects();
    }
  }, [userId]);

  const exportToExcel = () => {
    const filteredEmployees = employees.map(
      ({ key, createdAt, password, imageUrl, isAdmin, ...rest }) => rest
    );

    const ws = XLSX.utils.json_to_sheet(filteredEmployees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t("employees"));
    XLSX.writeFile(wb, `${t("employees")}.xlsx`);
  };

  const paginatedData = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const exportToWord = async (employee, project) => {
    try {
      // Create a new Document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Name and Address Section
              new Paragraph({
                children: [
                  new TextRun({
                    text: employee.name || "Name not available",
                    bold: true,
                    size: 32, // Optional: Adjust font size
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Address: ",
                    bold: true,
                    size: 24,
                  }),
                  new TextRun({
                    text: employee.address || "Address not available",
                    size: 24,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Email: ",
                    bold: true,
                    size: 24,
                  }),
                  new TextRun({
                    text: employee.email || "Email not available",
                    size: 24,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Department: ",
                    bold: true,
                    size: 24,
                  }),
                  new TextRun({
                    text:
                      formatDepartment(employee.department) || "Not provided",
                    size: 24,
                  }),
                ],
              }),

              // Add a blank paragraph to create space
              new Paragraph({}),

              // WORKING EXPERIENCE Section
              new Paragraph({
                children: [
                  new TextRun({
                    text: "WORKING EXPERIENCE",
                    bold: true,
                    size: 24,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Skill: ",
                    bold: true,
                    size: 24,
                  }),
                  new TextRun({
                    text: Array.isArray(employee.skills)
                      ? employee.skills.map(formatSkill).join(", ")
                      : employee.skills
                      ? formatSkill(employee.skills)
                      : "Not provided",
                    size: 24,
                  }),
                ],
              }),

              // Add a blank paragraph to create space
              new Paragraph({}),

              // TYPICAL PROJECTS Section
              new Paragraph({
                children: [
                  new TextRun({
                    text: "TYPICAL PROJECTS",
                    bold: true,
                    size: 24,
                  }),
                ],
              }),
              ...(Array.isArray(employee.projects) &&
              employee.projects.length > 0
                ? employee.projects.map((project, index) => [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "Project name: ",
                          bold: true,
                          size: 24,
                        }),
                        new TextRun({
                          text: project.name || "No name provided",
                          size: 24,
                        }),
                      ],
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "Role: ",
                          bold: true,
                          size: 24,
                        }),
                        new TextRun({
                          text: project.role || "No role provided",
                          size: 24,
                        }),
                      ],
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "Description: ",
                          bold: true,
                          size: 24,
                        }),
                        new TextRun({
                          text:
                            project.description || "No description provided",
                          size: 24,
                        }),
                      ],
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "Specification: ",
                          bold: true,
                          size: 24,
                        }),
                        new TextRun({
                          text:
                            project.specification ||
                            "No specification provided",
                          size: 24,
                        }),
                      ],
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "Languages and frameworks: ",
                          bold: true,
                          size: 24,
                        }),
                        new TextRun({
                          text: Array.isArray(project.languagesAndFrameworks)
                            ? project.languagesAndFrameworks.join(", ")
                            : "Not provided",
                          size: 24,
                        }),
                      ],
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "Technologies: ",
                          bold: true,
                          size: 24,
                        }),
                        new TextRun({
                          text: Array.isArray(project.technologies)
                            ? project.technologies.join(", ")
                            : "Not provided",
                          size: 24,
                        }),
                      ],
                    }),
                    // Add a blank paragraph to create space between projects
                    new Paragraph({}),
                  ])
                : [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "Not yet joined the project",
                          size: 24,
                          italics: true,
                        }),
                      ],
                    }),
                  ]),
            ],
          },
        ],
      });

      // Save the document as a .docx file
      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, `${employee.name || "Employee"}_CV.docx`);
      });
    } catch (error) {
      console.error("Error exporting to Word:", error);
    }
  };

  return (
    <div>
      <Button
        className="btn"
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={showAddPage}
        icon={<PlusOutlined />}
      >
        {t("Add New Employee")}
      </Button>
      <Button
        className="btn"
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={exportToExcel}
        icon={<ExportOutlined />}
      >
        {t("exportToExcel")}
      </Button>
      <Search
        placeholder={t("search")}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: 250 }}
        prefix={<SearchOutlined />}
      />
      <Tabs
        centered
        defaultActiveKey="all"
        onChange={(key) => setActiveTab(key)}
      >
        <TabPane tab={t("AllEmployees")} key="all">
          {/* All Employees tab content */}
        </TabPane>
        <TabPane tab={t("active")} key="active">
          {/* Active Employees tab content */}
        </TabPane>
        <TabPane tab={t("inactive")} key="inactive">
          {/* Inactive Employees tab content */}
        </TabPane>
        <TabPane tab={t("involved")} key="involved">
          {/* Involved Employees tab content */}
        </TabPane>
      </Tabs>

      <Table
        dataSource={paginatedData}
        rowKey="key"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: employees.length,
          onChange: (page, pageSize) =>
            handleTableChange({ current: page, pageSize }),
        }}
      >
        <Column
          title={t("avatar")}
          dataIndex="imageUrl"
          key="imageUrl"
          render={(text, record) => (
            <img
              src={record.imageUrl}
              alt={t("employee")}
              width="50"
              height="50"
              style={{ objectFit: "cover" }}
            />
          )}
        />
        <Column title={t("name")} dataIndex="name" key="name" />
        <Column title={t("email")} dataIndex="email" key="email" />
        <Column
          title={t("phoneNumber")}
          dataIndex="phoneNumber"
          key="phoneNumber"
        />
        <Column
          title={t("skills")}
          dataIndex="skills"
          key="skills"
          render={(text) => {
            if (Array.isArray(text)) {
              return text
                .map((skill) =>
                  t(`skill${skill.charAt(0).toUpperCase() + skill.slice(1)}`, {
                    defaultValue: skill.replace(/_/g, " "),
                  })
                )
                .join(", ");
            }
            return text;
          }}
        />
        <Column
          title={t("status")}
          dataIndex="status"
          key="status"
          render={(text) => {
            // Dịch giá trị của text
            const translatedText = t(text);

            // Xác định lớp CSS dựa trên giá trị đã dịch
            const className =
              translatedText === t("active")
                ? "status-active"
                : translatedText === t("inactive")
                ? "status-inactive"
                : translatedText === t("involved")
                ? "status-involved"
                : "";

            return (
              <span className={className}>
                {translatedText
                  ? translatedText.charAt(0).toUpperCase() +
                    translatedText.slice(1)
                  : ""}
              </span>
            );
          }}
        />
        <Column
          title={t("actions")}
          key="actions"
          render={(text, record) => (
            <Space>
              <Button
                icon={<EyeOutlined />}
                style={{ color: "green", borderColor: "green" }}
                onClick={() =>
                  navigate(`/employee-management/view/${record.key}`)
                }
              />
              <Button
                icon={<EditOutlined />}
                style={{ color: "blue", borderColor: "blue" }}
                onClick={() =>
                  navigate(`/employee-management/edit/${record.key}`)
                }
              />
              <Button
                icon={<DeleteOutlined />}
                style={{ color: "red", borderColor: "red" }}
                onClick={() => handleDelete(record)}
              />
              <Button
                icon={<ExportOutlined />}
                style={{ color: "black", borderColor: "black" }}
                onClick={() => exportToWord(record)}
              />
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default EmployeeManagement;