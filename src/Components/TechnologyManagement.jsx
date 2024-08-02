// import React, { useState, useEffect } from "react";
// import { Button, Input, message, Modal, Space, Table, Tabs } from "antd";
// import {
//   EditOutlined,
//   DeleteOutlined,
//   PlusOutlined,
//   SearchOutlined,
// } from "@ant-design/icons";
// import {
//   postCreateTechnology,
//   fetchTechnologyById,
//   fetchAllTechnology,
//   putUpdateTechnology,
//   deleteTechnology,
// } from "../service/TechnologyServices";
// import { useNavigate } from "react-router-dom";
// import "../assets/style/Pages/TechnologyManagement.scss";
// import { useTranslation } from "react-i18next";

// const { Column } = Table;
// const { confirm } = Modal;

// const TechnologyManagement = () => {
//   const [technologies, setTechnologies] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [filteredStatus, setFilteredStatus] = useState("All Technology");
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const { t } = useTranslation();

//   const loadTechnologies = async () => {
//     try {
//       const data = await fetchAllTechnology();
//       setTechnologies(data);
//     } catch (error) {
//       console.error("Failed to fetch technologies:", error);
//     }
//   };

//   useEffect(() => {
//     loadTechnologies();
//   }, []);

//   const handleTableChange = (pagination) => {
//     setCurrentPage(pagination.current);
//     setPageSize(pagination.pageSize);
//   };

//   const showAddPage = () => {
//     navigate("/technology-management/add");
//   };

//   const handleDelete = (record) => {
//     if (record.status.toLowerCase() !== "inactive") {
//       message.error("Only inactive technologies can be deleted.");
//       return;
//     }

//     confirm({
//       title: "Are you sure you want to delete this technology?",
//       onOk: async () => {
//         try {
//           await deleteTechnology(record.id);
//           message.success("Technology deleted successfully!");
//           loadTechnologies();
//         } catch (error) {
//           message.error("Failed to delete technology.");
//         }
//       },
//       onCancel() {
//         console.log("Cancel");
//       },
//     });
//   };

//   const handleTabChange = (key) => {
//     setFilteredStatus(key);
//     setCurrentPage(1); // Reset to first page when changing tabs
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1); // Reset to first page when searching
//   };

//   const filteredData = technologies.filter((item) => {
//     const matchesStatus =
//       filteredStatus === "All Technology" ||
//       item.status.toLowerCase() === filteredStatus.toLowerCase();
//     const matchesSearch = item.name
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     return matchesStatus && matchesSearch;
//   });

//   const paginatedData = filteredData.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const tabItems = [
//     { key: "All Technology", label: "All Technology" },
//     { key: "active", label: "Active" },
//     { key: "inactive", label: "Inactive" },
//   ];

//   return (
//     <div>
//       <Button
//         className="btn"
//         type="primary"
//         style={{ marginBottom: 16 }}
//         onClick={showAddPage}
//         icon={<PlusOutlined />}
//       ></Button>
//       <Input
//         placeholder={t("search")}
//         value={searchTerm}
//         onChange={handleSearchChange}
//         style={{ width: "250px", marginBottom: 16 }}
//         prefix={<SearchOutlined />}
//       />
//       <Tabs
//         defaultActiveKey="All Technology"
//         onChange={handleTabChange}
//         items={tabItems}
//         centered
//       />
//       <Table
//         dataSource={paginatedData}
//         rowKey="id"
//         pagination={{
//           current: currentPage,
//           pageSize: pageSize,
//           total: filteredData.length,
//           onChange: (page, pageSize) =>
//             handleTableChange({ current: page, pageSize }),
//         }}
//       >
//         <Column
//           title="Image"
//           dataIndex="imageUrl"
//           key="imageUrl"
//           render={(imageUrl) =>
//             imageUrl ? (
//               <img
//                 src={imageUrl}
//                 alt="Technology"
//                 style={{ width: 50, height: 50 }}
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = "path/to/placeholder.png";
//                 }}
//               />
//             ) : (
//               <span>No Image</span>
//             )
//           }
//         />
//         <Column title="Name" dataIndex="name" key="name" />
//         <Column title="Description" dataIndex="description" key="description" />
//         <Column
//           title="Status"
//           dataIndex="status"
//           key="status"
//           render={(text) => {
//             const className =
//               text === "active" ? "status-active" : "status-inactive";
//             return (
//               <span className={className}>
//                 {text ? text.charAt(0).toUpperCase() + text.slice(1) : ""}
//               </span>
//             );
//           }}
//         />
//         <Column
//           title="Actions"
//           key="actions"
//           render={(text, record) => (
//             <Space>
//               <Button
//                 icon={<EditOutlined />}
//                 style={{ color: "blue", borderColor: "blue" }}
//                 onClick={() =>
//                   navigate(`/technology-management/edit/${record.id}`)
//                 }
//               />
//               <Button
//                 icon={<DeleteOutlined />}
//                 style={{ color: "red", borderColor: "red" }}
//                 onClick={() => handleDelete(record)}
//               />
//             </Space>
//           )}
//         />
//       </Table>
//     </div>
//   );
// };

// export default TechnologyManagement;
import React, { useState, useEffect } from "react";
import { Button, Input, message, Modal, Space, Table, Tabs } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  fetchAllTechnology,
  deleteTechnology,
} from "../service/TechnologyServices";
import { useNavigate } from "react-router-dom";
import "../assets/style/Pages/TechnologyManagement.scss";
import { useTranslation } from "react-i18next";

const { Column } = Table;
const { confirm } = Modal;

const TechnologyManagement = () => {
  const [technologies, setTechnologies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredStatus, setFilteredStatus] = useState("All Technology");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  // Load technologies from the server
  const loadTechnologies = async () => {
    try {
      const data = await fetchAllTechnology();
      setTechnologies(data);
    } catch (error) {
      console.error("Failed to fetch technologies:", error);
    }
  };

  useEffect(() => {
    loadTechnologies();
  }, []);

  // Handle table pagination changes
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Show add technology page
  const showAddPage = () => {
    navigate("/technology-management/add");
  };

  // Handle technology deletion
  const handleDelete = (record) => {
    if (record.status.toLowerCase() !== "inactive") {
      message.error(t("Only inactive technologies can be deleted."));
      return;
    }

    confirm({
      title: t("Are you sure you want to delete this technology?"),
      onOk: async () => {
        try {
          await deleteTechnology(record.id);
          message.success("Technology deleted successfully!");
          loadTechnologies(); // Reload technologies after deletion
        } catch (error) {
          message.error(t("Failed to delete technology."));
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // Handle tab change
  const handleTabChange = (key) => {
    setFilteredStatus(key);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Filter and paginate data
  const filteredData = technologies.filter((item) => {
    const matchesStatus =
      filteredStatus === "All Technology" ||
      item.status.toLowerCase() === filteredStatus.toLowerCase();
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Tab items for filtering
  const tabItems = [
    { key: "All Technology", label: t("All Technology") },
    { key: "active", label: t("Active") },
    { key: "inactive", label: t("Inactive") },
  ];

  return (
    <div>
      <Button
        className="btn"
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={showAddPage}
        icon={<PlusOutlined />}
      >
        Add Technology
      </Button>
      <Input
        placeholder={t("search")}
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ width: "250px", marginBottom: 16 }}
        prefix={<SearchOutlined />}
      />
      <Tabs
        defaultActiveKey="All Technology"
        onChange={handleTabChange}
        items={tabItems}
        centered
      />
      <Table
        dataSource={paginatedData}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredData.length,
          onChange: (page, pageSize) =>
            handleTableChange({ current: page, pageSize }),
        }}
      >
        <Column
          title={t("Image")}
          dataIndex="imageUrl"
          key="imageUrl"
          render={(imageUrl) =>
            imageUrl ? (
              <img
                src={imageUrl}
                alt="Technology"
                style={{ width: 50, height: 50 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "path/to/placeholder.png";
                }}
              />
            ) : (
              <span>No Image</span>
            )
          }
        />
        <Column title={t("Name")} dataIndex="name" key="name" />
        <Column title={t("Description")} dataIndex="description" key="description" />
        <Column
          title={t("Status")}
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
          title={t("Actions")}
          key="actions"
          render={(text, record) => (
            <Space>
              <Button
                icon={<EditOutlined />}
                style={{ color: "blue", borderColor: "blue" }}
                onClick={() =>
                  navigate(`/technology-management/edit/${record.id}`)
                }
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

export default TechnologyManagement;
