import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAllProjects, deleteProject } from "../service/Project";
import { Button, Modal, message } from "antd";

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-GB'); // 'en-GB' cho định dạng "dd/mm/yyyy"
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const allProjects = await fetchAllProjects();
        const projectData = allProjects.find(project => project.key === id);
        if (projectData) {
          setProject(projectData);
        } else {
          message.error("Project not found");
          navigate("/project-management");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        message.error("Error fetching project data");
        navigate("/project-management");
      }
    };
    fetchProject();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await deleteProject(project.key);
      message.success("Project deleted successfully");
      navigate("/project-management");
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

  return (
    <div style={{ padding: "24px", background: "#fff" }}>
      <Button type="default" onClick={() => navigate("/project-management")}>
        Back
      </Button>
      <h2>Project Detail</h2>
      {project.imageUrl && <img src={project.imageUrl} alt="Project" style={{ width: "100%", marginBottom: "20px" }} />}
      <p><strong>ID:</strong> {project.key}</p>
      <p><strong>Name:</strong> {project.name}</p>
      <p><strong>Description:</strong> {project.description}</p>
      <p><strong>Client:</strong> {project.clientName}</p>
      <p><strong>Project Manager:</strong> {project.projectManager}</p>
      <p><strong>Team Members:</strong> {project.teamMembers}</p>
      <p><strong>Budget:</strong> {project.budget}</p>
      <p><strong>Status:</strong> {project.status}</p>
      <p><strong>Priority:</strong> {project.priority}</p>
      <p><strong>Category:</strong> {project.category}</p>
      <p><strong>Start Date:</strong> {formatDate(project.startDate)}</p>
      <p><strong>End Date:</strong> {formatDate(project.endDate)}</p>
      <p><strong>Technologies Used:</strong> {project.technologies}</p>
      <Button type="primary" onClick={() => navigate(`/edit-project/${project.key}`)} style={{ marginRight: "10px" }}>
        Edit
      </Button>
      <Button type="danger" onClick={showDeleteConfirm}>
        Delete
      </Button>
    </div>
  );
};

export default ProjectDetail;
