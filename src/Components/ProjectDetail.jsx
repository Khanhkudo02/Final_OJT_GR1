import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAllProjects } from "../service/Project";

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      const allProjects = await fetchAllProjects();
      const projectData = allProjects.find(project => project.key === id);
      setProject(projectData);
    };
    fetchProject();
  }, [id]);

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "24px", background: "#fff" }}>
      <h2>Project Detail</h2>
      <p><strong>ID:</strong> {project.key}</p>
      <p><strong>Name:</strong> {project.name}</p>
      <p><strong>Description:</strong> {project.description}</p>
      <p><strong>Client:</strong> {project.client}</p>
      <p><strong>Project Manager:</strong> {project.projectManager}</p>
      <p><strong>Team Members:</strong> {project.teamMembers}</p>
      <p><strong>Budget:</strong> {project.budget}</p>
      <p><strong>Status:</strong> {project.status}</p>
      <p><strong>Priority:</strong> {project.priority}</p>
      <p><strong>Category:</strong> {project.category}</p>
      <p><strong>Start Date:</strong> {project.startDate}</p>
      <p><strong>End Date:</strong> {project.endDate}</p>
      <p><strong>Technologies Used:</strong> {project.technologies}</p>
    </div>
  );
};

export default ProjectDetail;
