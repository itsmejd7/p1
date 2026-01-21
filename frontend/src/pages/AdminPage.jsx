import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import "./AdminPage.css";
import { isAdmin, isUser } from "../auth/auth";

export default function AdminPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Planning"
  });
  const nav = useNavigate();


  const role = isAdmin() ? "admin" : isUser() ? "user" : "guest";

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/projects");
      const data = await res.json();
      setProjects(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProject = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", status: "Planning" });
    setShowForm(true);
  };

  const handleEditProject = (project) => {
    setEditingId(project.id);
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status
    });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (editingId) {
        const res = await fetch(`http://localhost:5000/api/projects/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          alert("Project updated successfully!");
          setShowForm(false);
          fetchProjects();
        }
      } else {
        const res = await fetch("http://localhost:5000/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          alert("Project added successfully!");
          setShowForm(false);
          fetchProjects();
        }
      }
    } catch (err) {
      console.error("Error saving project:", err);
      alert("Error saving project");
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        alert("Project deleted successfully!");
        fetchProjects();
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Error deleting project");
    }
  };

  // Role-based filtering
  const visibleProjects =
    role === "admin" ? projects : role === "user" ? projects.slice(0, 3) : projects.slice(0, 1);

  return (
    <div className="app-wrapper">
      <NavBar />
      <div className="admin-page-container">
        <div className="admin-header">
          <div>
            <h1>Projects</h1>
          </div>
          {role === "admin" && (
            <button className="add-project-btn" onClick={handleAddProject}>
              + Add Project
            </button>
          )}
        </div>

        {showForm && role === "admin" && (
          <div className="form-modal">
            <div className="form-content">
              <h2>{editingId ? "Edit Project" : "Add New Project"}</h2>
              
              <input
                type="text"
                name="name"
                placeholder="Project Name"
                value={formData.name}
                onChange={handleFormChange}
              />
              
              <textarea
                name="description"
                placeholder="Project Description"
                value={formData.description}
                onChange={handleFormChange}
                rows="4"
              ></textarea>
              
              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Active">Active</option>
              </select>

              <div className="form-buttons">
                <button className="save-btn" onClick={handleSubmit}>
                  {editingId ? "Update" : "Add"} Project
                </button>
                <button className="cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading projects...</div>
        ) : (
          <div className="projects-table-container">
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleProjects.map(project => (
                  <tr key={project.id}>
                    <td className="project-name">{project.name}</td>
                    <td className="project-desc">{project.description}</td>
                    <td>
                      <span className={`status-badge ${project.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="view-btn"
                        onClick={() => nav(`/project/${project.slug || project.id}`)}
                      >
                        View
                      </button>
                      {role === "admin" && (
                        <>
                          <button
                            className="edit-btn"
                            onClick={() => handleEditProject(project)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
