import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import "./ProjectDetail.css";

export default function ProjectDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [project, setProject] = useState(null);
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${id}`);
        const data = await response.json();
        setProject(data);

        // Generate dynamic card data based on project
        const cards = Array.from({ length: 12 }, (_, i) => ({
          id: i + 1,
          title: `${data.name} - Task ${i + 1}`,
          description: `Task description for ${data.name}`,
          img: "https://www.purppledesigns.com/wp-content/uploads/2023/11/download-4.png",
          projectId: data.id,
          status: ["Pending", "In Progress", "Completed"][Math.floor(Math.random() * 3)],
        }));
        setCardData(cards);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading project...</div>;
  }

  if (!project) {
    return <div className="error">Project not found</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      <div className="flex-grow-1 overflow-auto">
        <div className="project-detail-container">
        <button className="back-button" onClick={() => nav(-1)}>
          ← Back to Projects
        </button>

        <div className="project-header" style={{ backgroundColor: project.color }}>
          <h1>{project.name}</h1>
          <p className="project-description">{project.description}</p>
          <span className={`status-badge ${project.status.toLowerCase()}`}>
            {project.status}
          </span>
        </div>

        <div className="project-stats">
          <div className="stat-card">
            <h3>{cardData.length}</h3>
            <p>Total Tasks</p>
          </div>
          <div className="stat-card">
            <h3>{cardData.filter(c => c.status === "Completed").length}</h3>
            <p>Completed</p>
          </div>
          <div className="stat-card">
            <h3>{cardData.filter(c => c.status === "In Progress").length}</h3>
            <p>In Progress</p>
          </div>
          <div className="stat-card">
            <h3>{cardData.filter(c => c.status === "Pending").length}</h3>
            <p>Pending</p>
          </div>
        </div>

        <h2>Project Tasks</h2>
        <div className="cards-grid">
          {cardData.map((card) => (
            <div key={card.id} className="task-card">
              <img src={card.img} alt={card.title} />
              <div className="card-body">
                <h5>{card.title}</h5>
                <p>{card.description}</p>
                <span className={`task-status ${card.status.toLowerCase()}`}>
                  {card.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
