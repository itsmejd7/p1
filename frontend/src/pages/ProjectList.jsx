import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import "./ProjectsList.css";

export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else {
        console.error("Failed to fetch projects");
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="list-wrapper">
        <NavBar />
        <div className="list-container">
          <div className="loading">Loading vehicles...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="list-wrapper">
      <NavBar />

      <div className="list-container">
        {/* Header Section - styled like ProjectDetail header */}
        <div className="header-section" style={{ marginBottom: 40 }}>
          <div className="header-content" style={{ textAlign: "center", alignItems: "center" }}>
            <h1 className="list-title" style={{ marginBottom: 8 }}>Tata Cars</h1>
            <p className="list-subtitle" style={{ marginBottom: 18 }}>Explore our range of Tata vehicles</p>
            <div className="list-divider" style={{ margin: "0 auto" }}></div>
          </div>
        </div>

        {/* Vehicles List - OEM style, one row per vehicle */}
        <div className="vehicles-list" role="list">
          {projects.map((project) => (
            <article key={project.id || project.slug} className="vehicle-row" role="listitem" aria-label={project.name}>
              <div className="vehicle-content">
                <div className="vehicle-main">
                  <h2 className="vehicle-name">{project.name}</h2>
                  <p className="vehicle-description">{project.shortDescription || project.description}</p>
                </div>

                <div className="vehicle-info-badges" aria-hidden={false}>
                  <div className="info-badge">
                    <span className="badge-label">Body Type</span>
                    <span className="badge-value">{project.bodyType || "—"}</span>
                  </div>
                  <div className="info-badge">
                    <span className="badge-label">Fuel Options</span>
                    <span className="badge-value">{(project.fuelOptions && project.fuelOptions.join(", ")) || "—"}</span>
                  </div>
                  <div className="info-badge">
                    <span className="badge-label">Starting Price</span>
                    <span className="badge-value">{project.startingPrice || "Contact Dealer"}</span>
                  </div>
                </div>
              </div>

              <div className="vehicle-actions">
                <span
                  className={`status-badge ${String(project.status || "on-sale").toLowerCase().replace(/\s+/g, "-")}`}
                  aria-live="polite"
                >
                  {project.status || "On Sale"}
                </span>

                <div className="action-buttons" role="group" aria-label={`Actions for ${project.name}`}>
                  <button
                    className="btn-view-details"
                    onClick={() => nav(`/project/${project.slug || project.id}`)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn-compare"
                    onClick={() => {
                      /* lightweight compare action - navigation or UI handled elsewhere */
                      console.log("Compare clicked for", project.slug || project.id);
                    }}
                  >
                    Compare
                  </button>
                </div>

                {/* Optional image aligned right - kept subtle and small */}
                {project.heroImage && (
                  <div className="header-image" style={{ marginTop: 12 }}>
                    <img
                      src={project.heroImage}
                      alt={project.name}
                      style={{ maxWidth: 220, width: "100%", height: "auto", borderRadius: 6 }}
                    />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}