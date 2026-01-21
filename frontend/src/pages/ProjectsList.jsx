import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import "./ProjectsList.css";
import { isAdmin, isUser } from "../auth/auth";

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((res) => res.json())
      .then((data) => {
        // Role-based filtering: admins see all, users see a subset
        const filtered = isAdmin() ? data : data.slice(0, 2);
        setProjects(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading projects...</div>;

  return (
    <div className="app-wrapper">
      <NavBar />
      <div className="projects-container">
        <h1>Tata Motors - Projects</h1>
        <div className="projects-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              style={{ backgroundColor: project.color }}
              onClick={() => nav(`/project/${project.id}`)}
            >
              <div className="project-content">
                <h2>{project.name}</h2>
                <p className="project-description">{project.description}</p>
                <span
                  className={`project-status ${project.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {project.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
