import React from 'react'
import '../assets/style/Pages/Project.scss'

const ProjectManagement = () => {
  return (
    <main>
      <section className="project">
        <div className="project-view"></div>
        <div className="project-create"></div>
        <div className="project-edit"></div>
        <div className="project-delete"></div>
        <div className="project-export"></div>
      </section>

      <section className="project-assign">
        <div className="project-assign-employee"></div>
        <div className="project-send-email"></div>
      </section>

      <section className="project-tracking">

      </section>
    </main>
  );
}

export default ProjectManagement
