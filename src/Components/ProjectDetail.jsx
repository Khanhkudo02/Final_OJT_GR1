// import { Button, Modal, message } from "antd";
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { fetchAllLanguages } from "../service/LanguageServices";
// import { deleteProjectPermanently, fetchAllProjects } from "../service/Project";
// import { fetchAllTechnology } from "../service/TechnologyServices";
// import dayjs from "dayjs";

// const ProjectDetail = () => {
//   const { id } = useParams();
//   const [project, setProject] = useState(null);
//   const [technologies, setTechnologies] = useState([]);
//   const [languages, setLanguages] = useState([]);
//   const navigate = useNavigate();

//   const formatDate = (date) => {
//     if (!date) return "";
//     const dateObj = dayjs(date, "YYYY-MM-DD");
//     return dateObj.format("DD/MM/YYYY");
//   };

//   // Convert IDs to names using the provided list
//   const getNamesFromIds = (ids = [], options = []) => {
//     if (!Array.isArray(ids) || !Array.isArray(options)) return "";
//     return options
//       .filter((option) => ids.includes(option.value))
//       .map((option) => option.label)
//       .join(", "); // Join names with a comma
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [allProjects, allTechnologies, allLanguages] = await Promise.all([
//           fetchAllProjects(),
//           fetchAllTechnology(),
//           fetchAllLanguages(),
//         ]);

//         const projectData = allProjects.find((project) => project.key === id);
//         if (projectData) {
//           setProject(projectData);
//         } else {
//           message.error("Project not found");
//           navigate("/project-management");
//         }

//         setTechnologies(
//           allTechnologies.map((tech) => ({
//             label: tech.name,
//             value: tech.key,
//           }))
//         );
//         setLanguages(
//           allLanguages.map((lang) => ({
//             label: lang.name,
//             value: lang.key,
//           }))
//         );
//       } catch (error) {
//         console.error("Error fetching project or related data:", error);
//         message.error("Error fetching project data");
//         navigate("/project-management");
//       }
//     };

//     fetchData();
//   }, [id, navigate]);

//   const handleDelete = async () => {
//     try {
//       if (project && project.key) {
//         await deleteProjectPermanently(project.key);
//         message.success("Project deleted successfully");
//         navigate("/project-management");
//       } else {
//         message.error("Project not found");
//       }
//     } catch (error) {
//       message.error("Failed to delete project");
//     }
//   };

//   const showDeleteConfirm = () => {
//     Modal.confirm({
//       title: "Are you sure you want to delete this project?",
//       content: "This action cannot be undone",
//       okText: "Yes",
//       okType: "danger",
//       cancelText: "No",
//       onOk: handleDelete,
//     });
//   };

//   if (!project) {
//     return <div>Loading...</div>;
//   }

//   const displayedTechnologies = getNamesFromIds(
//     project.technologies || [],
//     technologies
//   );
//   const displayedLanguages = getNamesFromIds(
//     project.languages || [],
//     languages
//   );

//   const formatCategory = (category) =>
//     category
//       .split(" ")
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//       .join(" ");

//   const formattedCategories = Array.isArray(project.category)
//     ? project.category.map(formatCategory).join(", ")
//     : project.category
//     ? formatCategory(project.category)
//     : "No categories";

//   return (
//     <div style={{ padding: "24px", background: "#fff" }}>
//       <Button type="default" onClick={() => navigate("/project-management")}>
//         Back
//       </Button>
//       <h2>Project Detail</h2>
//       {project.imageUrl && (
//         <div style={{ marginBottom: "20px", textAlign: "center" }}>
//           <img
//             src={project.imageUrl}
//             alt="Project"
//             style={{
//               maxWidth: "100%",
//               maxHeight: "400px",
//               objectFit: "contain",
//             }}
//           />
//         </div>
//       )}
//       <p>
//         <strong>Name:</strong> {project.name}
//       </p>
//       <p>
//         <strong>Description:</strong> {project.description}
//       </p>
//       <p>
//         <strong>Client:</strong> {project.clientName}
//       </p>
//       <p>
//         <strong>Project Manager:</strong> {project.projectManager}
//       </p>
//       <p>
//         <strong>Team Members:</strong> {project.teamMembers}
//       </p>
//       <p>
//         <strong>Budget:</strong> {project.budget}
//       </p>
//       <p>
//         <strong>Status:</strong> {project.status}
//       </p>
//       <p>
//         <strong>Priority:</strong> {project.priority}
//       </p>
//       <p>
//         <strong>Category:</strong> {formattedCategories}
//       </p>
//       <p>
//         <strong>Start Date:</strong> {formatDate(project.startDate)}
//       </p>
//       <p>
//         <strong>End Date:</strong> {formatDate(project.endDate)}
//       </p>
//       <p>
//         <strong>Technologies Used:</strong> {displayedTechnologies}
//       </p>
//       <p>
//         <strong>Languages Used:</strong> {displayedLanguages}
//       </p>
//       <Button
//         type="primary"
//         onClick={() => navigate(`/edit-project/${project.key}`)}
//         style={{ marginRight: "10px" }}
//       >
//         Edit
//       </Button>
//       <Button type="danger" onClick={showDeleteConfirm}>
//         Delete
//       </Button>
//     </div>
//   );
// };

// export default ProjectDetail;
import { Button, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAllLanguages } from "../service/LanguageServices";
import { deleteProjectPermanently, fetchAllProjects } from "../service/Project";
import { fetchAllTechnology } from "../service/TechnologyServices";
import { fetchAllEmployees } from "../service/EmployeeServices";
import dayjs from "dayjs";

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [technologies, setTechnologies] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return "";
    const dateObj = dayjs(date, "YYYY-MM-DD");
    return dateObj.format("DD/MM/YYYY");
  };

  // Convert IDs to names using the provided list
  const getNamesFromIds = (ids = [], options = []) => {
    if (!Array.isArray(ids) || !Array.isArray(options)) return "";
    return options
      .filter((option) => ids.includes(option.value))
      .map((option) => option.label)
      .join(", "); // Join names with a comma
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allProjects, allTechnologies, allLanguages, allEmployees] =
          await Promise.all([
            fetchAllProjects(),
            fetchAllTechnology(),
            fetchAllLanguages(),
            fetchAllEmployees(),
          ]);

        const projectData = allProjects.find((project) => project.key === id);
        if (projectData) {
          setProject(projectData);
        } else {
          message.error("Project not found");
          navigate("/project-management");
        }

        setTechnologies(
          allTechnologies.map((tech) => ({
            label: tech.name,
            value: tech.key,
          }))
        );
        setLanguages(
          allLanguages.map((lang) => ({
            label: lang.name,
            value: lang.key,
          }))
        );
        setEmployees(
          allEmployees
            .filter((emp) => emp.role === "employee")
            .map((emp) => ({
              label: emp.name,
              value: emp.key,
            }))
        );
      } catch (error) {
        console.error("Error fetching project or related data:", error);
        message.error("Error fetching project data");
        navigate("/project-management");
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      if (project && project.key) {
        await deleteProjectPermanently(project.key);
        message.success("Project deleted successfully");
        navigate("/project-management");
      } else {
        message.error("Project not found");
      }
    } catch (error) {
      message.error("Failed to delete project");
    }
  };

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: "Are you sure you want to delete this project?",
      content: "This action cannot be undone",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: handleDelete,
    });
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  const displayedTechnologies = getNamesFromIds(
    project.technologies || [],
    technologies
  );
  const displayedLanguages = getNamesFromIds(
    project.languages || [],
    languages
  );
  const displayedTeamMembers = getNamesFromIds(
    project.teamMembers || [],
    employees
  );

  const formatCategory = (category) =>
    category
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const formattedCategories = Array.isArray(project.category)
    ? project.category.map(formatCategory).join(", ")
    : project.category
    ? formatCategory(project.category)
    : "No categories";

  return (
    <div style={{ padding: "24px", background: "#fff" }}>
      <Button type="default" onClick={() => navigate("/project-management")}>
        Back
      </Button>
      <h2>Project Detail</h2>
      {project.imageUrl && (
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <img
            src={project.imageUrl}
            alt="Project"
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
              objectFit: "contain",
            }}
          />
        </div>
      )}
      <p>
        <strong>Name:</strong> {project.name}
      </p>
      <p>
        <strong>Description:</strong> {project.description}
      </p>
      <p>
        <strong>Client:</strong> {project.clientName}
      </p>
      <p>
        <strong>Project Manager:</strong> {project.projectManager}
      </p>
      <p>
        <strong>Team Members:</strong> {displayedTeamMembers}
      </p>
      <p>
        <strong>Budget:</strong> {project.budget}
      </p>
      <p>
        <strong>Status:</strong> {project.status}
      </p>
      <p>
        <strong>Priority:</strong> {project.priority}
      </p>
      <p>
        <strong>Category:</strong> {formattedCategories}
      </p>
      <p>
        <strong>Start Date:</strong> {formatDate(project.startDate)}
      </p>
      <p>
        <strong>End Date:</strong> {formatDate(project.endDate)}
      </p>
      <p>
        <strong>Technologies Used:</strong> {displayedTechnologies}
      </p>
      <p>
        <strong>Languages Used:</strong> {displayedLanguages}
      </p>
      <Button
        type="primary"
        onClick={() => navigate(`/edit-project/${project.key}`)}
        style={{ marginRight: "10px" }}
      >
        Edit
      </Button>
      <Button type="danger" onClick={showDeleteConfirm}>
        Delete
      </Button>
    </div>
  );
};

export default ProjectDetail;
