import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import "./AdminPage.css";

export default function AdminPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Planning"
  });
  const nav = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/projects");
      const data = await res.json();
      setCars(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching cars:", err);
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
          alert("Car updated successfully!");
          setShowForm(false);
          fetchCars();
        }
      } else {
        const res = await fetch("http://localhost:5000/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          alert("Car added successfully!");
          setShowForm(false);
          fetchCars();
        }
      }
    } catch (err) {
      console.error("Error saving car:", err);
      alert("Error saving car");
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        alert("Car deleted successfully!");
        fetchCars();
      }
    } catch (err) {
      console.error("Error deleting car:", err);
      alert("Error deleting car");
    }
  };

  return (
    <div className="app-wrapper">
      <NavBar />
      <div className="admin-page-container">
        <div className="admin-header">
          <div>
            <h1>Tata Cars Management</h1>
            <p>Add, Edit, and Delete Tata vehicles from inventory</p>
          </div>
          <button className="add-project-btn" onClick={handleAddProject}>
            + Add Car
          </button>
        </div>

        {showForm && (
          <div className="form-modal">
            <div className="form-content">
              <h2>{editingId ? "Edit Car" : "Add New Car"}</h2>
              
              <input
                type="text"
                name="name"
                placeholder="Car Name"
                value={formData.name}
                onChange={handleFormChange}
              />
              
              <textarea
                name="description"
                placeholder="Car Description"
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
                  {editingId ? "Update" : "Add"} Car
                </button>
                <button className="cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading cars...</div>
        ) : (
          <div className="projects-table-container">
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Car Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map(project => (
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
                        onClick={() => nav(`/project/${project.id}`)}
                      >
                        View
                      </button>
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
