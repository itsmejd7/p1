import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import "./ProjectDetail.css";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import defaultBrochure from "../assets/Broucher/nexon-digital-brochure.pdf";

export default function ProjectDetail() {
  const nav = useNavigate();
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Model Overview");
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [selectedGallery, setSelectedGallery] = useState("exterior");

  useEffect(() => {
    fetchProject();
  }, [slug]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/slug/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
        setSelectedCity(data.dealers && data.dealers.length > 0 ? data.dealers[0].city : "Mumbai");
      } else if (res.status === 401 || res.status === 403) {
        // Authentication error - logout by clearing auth and redirecting to login
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        nav("/login");
      } else if (res.status === 404) {

        alert("Project not found");
        nav(-1);
      } else {
        // Other errors
        alert("Error loading project");
        nav(-1);
      }
    } catch (err) {
      console.error("Error fetching project:", err);
      alert("Network error loading project details");
      nav(-1);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="detail-wrapper">
        <NavBar />
        <div className="detail-container" style={{ textAlign: "center", padding: "60px 20px" }}>
          <h2>Loading project details...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="detail-wrapper">
        <NavBar />
        <div className="detail-container" style={{ textAlign: "center", padding: "60px 20px" }}>
          <h2>Project not found</h2>
          <button className="back-btn" onClick={() => nav(-1)}>â† Back</button>
        </div>
        <Footer />
      </div>
    );
  }

  const tabs = [
    "Model Overview",
    "Performance",
    "Variants & Pricing",
    "Specifications",
    "Features",
    "Safety & Ratings",
    "Gallery",
    "Compare",
    "Dealer & Test Drive"
  ];

  const filteredDealers = project.dealers?.filter(d => d.city === selectedCity) || [];

  // Prepare chart data
  const performanceChartData = project.performance?.engines?.map(e => ({
    name: e.name,
    power: e.power,
    torque: e.torque,
    acceleration: e.acceleration
  })) || [];

  const variantPriceData = project.variants?.map(v => ({
    name: v.name,
    price: parseFloat(v.price)
  })) || [];

  const comparisonChartData = project.comparison?.map(c => ({
    model: c.model,
    price: parseFloat(c.price),
    power: c.power
  })) || [];

  return (
    <div className="detail-wrapper">
      <NavBar />

      <div className="detail-container">
        
        <button className="back-btn" onClick={() => nav(-1)}>
          Back to Projects
        </button>

       
        <div className="header-section">
          <div className="header-content">
            <h1>{project.name}</h1>
            <p className="model-subtitle">{project.modelYear} | {project.bodyType}</p>
            <div className="header-meta">
              <span className="meta-badge">Starting from {project.startingPrice}</span>
              <span className="meta-divider">|</span>
              <span className="meta-badge">{project.seatingCapacity}</span>
              <span className="meta-divider">|</span>
              <span className="meta-badge">Launched {project.launchYear}</span>
            </div>
            <div className="header-actions">
              <button className="btn-primary">Book Test Drive</button>
              <a
                className="btn-secondary"
                href={project.brochure || defaultBrochure}
                target="_blank"
                rel="noopener noreferrer"
                download
                style={{ textDecoration: "none" }}
              >
                Download Brochure
              </a>
            </div>
          </div>
          <div className="header-image">
            <img src={project.heroImage} alt={project.name} />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tabs-section">
          <div className="tabs-nav">
            {tabs.map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="tabs-content">
          {/* Model Overview */}
          {activeTab === "Model Overview" && (
            <section className="tab-pane">
              <h2>Model Overview</h2>
              <div className="overview-grid">
                <div className="overview-box">
                  <label>Body Type</label>
                  <p>{project.bodyType}</p>
                </div>
                <div className="overview-box">
                  <label>Fuel Options</label>
                  <p>{project.fuelOptions?.join(", ")}</p>
                </div>
                <div className="overview-box">
                  <label>Seating Capacity</label>
                  <p>{project.seatingCapacity}</p>
                </div>
                <div className="overview-box">
                  <label>Launch Year</label>
                  <p>{project.launchYear}</p>
                </div>
              </div>

              <div className="section-divider"></div>

              <h3>Key Highlights</h3>
              <ul className="highlights-list">
                {project.highlights?.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Performance Tab */}
          {activeTab === "Performance" && (
            <section className="tab-pane">
              <h2>Performance</h2>

              <h3>Engine Options</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Engine</th>
                    <th>Power (PS)</th>
                    <th>Torque (Nm)</th>
                    <th>0-100 km/h</th>
                    <th>Top Speed</th>
                    <th>Transmission</th>
                  </tr>
                </thead>
                <tbody>
                  {project.performance?.engines?.map((e, i) => (
                    <tr key={i}>
                      <td><strong>{e.name}</strong></td>
                      <td>{e.power}</td>
                      <td>{e.torque}</td>
                      <td>{e.acceleration}s</td>
                      <td>{e.topSpeed} km/h</td>
                      <td>{e.transmission}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="section-divider"></div>

              <h3>Drive Modes</h3>
              <ul className="features-list">
                {project.performance?.driveModes?.map((mode, i) => (
                  <li key={i}>{mode}</li>
                ))}
              </ul>

              <div className="section-divider"></div>

              <h3>Transmission Options</h3>
              <ul className="features-list">
                {project.performance?.transmissionOptions?.map((trans, i) => (
                  <li key={i}>{trans}</li>
                ))}
              </ul>

              {performanceChartData.length > 0 && (
                <div className="chart-wrapper">
                  <h3>Power vs Torque by Engine</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceChartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis yAxisId="left" label={{ value: "Power (PS)", angle: -90, position: "insideLeft" }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: "Torque (Nm)", angle: 90, position: "insideRight" }} />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="power" fill="#1f3a93" name="Power (PS)" />
                      <Bar yAxisId="right" dataKey="torque" fill="#ff6b35" name="Torque (Nm)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>
          )}

          {/* Variants & Pricing */}
          {activeTab === "Variants & Pricing" && (
            <section className="tab-pane">
              <h2>Variants & Pricing</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Variant</th>
                    <th>Fuel Type</th>
                    <th>Transmission</th>
                    <th>Mileage / Range</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {project.variants?.map((v, i) => (
                    <tr key={i}>
                      <td><strong>{v.name}</strong></td>
                      <td>{v.fuel}</td>
                      <td>{v.transmission}</td>
                      <td>{v.mileage}</td>
                      <td className="price">{v.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {variantPriceData.length > 0 && (
                <div className="chart-wrapper">
                  <h3>Price Comparison by Variant</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={variantPriceData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis label={{ value: "Price (â‚¹ Lakhs)", angle: -90, position: "insideLeft" }} />
                      <Tooltip formatter={(value) => `â‚¹${value}L`} />
                      <Bar dataKey="price" fill="#1f3a93" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>
          )}

          {/* Specifications */}
          {activeTab === "Specifications" && (
            <section className="tab-pane">
              <h2>Specifications</h2>

              {project.specifications?.engine && (
                <>
                  <h3>Engine & Performance</h3>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Engine Type</th>
                        <th>Power</th>
                        <th>Torque</th>
                        <th>Max Speed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.specifications.engine.map((e, i) => (
                        <tr key={i}>
                          <td><strong>{e.type}</strong></td>
                          <td>{e.power}</td>
                          <td>{e.torque}</td>
                          <td>{e.maxSpeed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="section-divider"></div>
                </>
              )}

              {project.specifications?.dimensions && (
                <>
                  <h3>Dimensions & Capacity</h3>
                  <div className="specs-grid">
                    <div className="spec-item">
                      <label>Length</label>
                      <p>{project.specifications.dimensions.length}</p>
                    </div>
                    <div className="spec-item">
                      <label>Width</label>
                      <p>{project.specifications.dimensions.width}</p>
                    </div>
                    <div className="spec-item">
                      <label>Height</label>
                      <p>{project.specifications.dimensions.height}</p>
                    </div>
                    <div className="spec-item">
                      <label>Wheelbase</label>
                      <p>{project.specifications.dimensions.wheelbase}</p>
                    </div>
                    <div className="spec-item">
                      <label>Ground Clearance</label>
                      <p>{project.specifications.dimensions.groundClearance}</p>
                    </div>
                    <div className="spec-item">
                      <label>Curb Weight</label>
                      <p>{project.specifications.dimensions.curb_weight}</p>
                    </div>
                    <div className="spec-item">
                      <label>Boot Space</label>
                      <p>{project.specifications.dimensions.bootSpace}</p>
                    </div>
                    <div className="spec-item">
                      <label>Fuel Tank</label>
                      <p>{project.specifications.dimensions.fuelTank}</p>
                    </div>
                  </div>

                  <div className="section-divider"></div>
                </>
              )}

              {project.specifications?.chassis && (
                <>
                  <h3>Chassis & Suspension</h3>
                  <div className="specs-grid">
                    <div className="spec-item">
                      <label>Suspension</label>
                      <p>{project.specifications.chassis.suspension}</p>
                    </div>
                    <div className="spec-item">
                      <label>Steering</label>
                      <p>{project.specifications.chassis.steering}</p>
                    </div>
                    <div className="spec-item">
                      <label>Brakes</label>
                      <p>{project.specifications.chassis.brakes}</p>
                    </div>
                    <div className="spec-item">
                      <label>Tyres</label>
                      <p>{project.specifications.chassis.tyres}</p>
                    </div>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Features */}
          {activeTab === "Features" && (
            <section className="tab-pane">
              <h2>Features</h2>

              {project.features?.safety && (
                <>
                  <h3>Safety Features</h3>
                  <ul className="features-list">
                    {project.features.safety.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>

                  <div className="section-divider"></div>
                </>
              )}

              {project.features?.comfort && (
                <>
                  <h3>Comfort Features</h3>
                  <ul className="features-list">
                    {project.features.comfort.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>

                  <div className="section-divider"></div>
                </>
              )}

              {project.features?.infotainment && (
                <>
                  <h3>Infotainment & Connectivity</h3>
                  <ul className="features-list">
                    {project.features.infotainment.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>

                  <div className="section-divider"></div>
                </>
              )}

              {project.features?.exterior && (
                <>
                  <h3>Exterior Features</h3>
                  <ul className="features-list">
                    {project.features.exterior.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>

                  <div className="section-divider"></div>
                </>
              )}

              {project.features?.interior && (
                <>
                  <h3>Interior Features</h3>
                  <ul className="features-list">
                    {project.features.interior.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          )}

          {/* Safety & Ratings */}
          {activeTab === "Safety & Ratings" && (
            <section className="tab-pane">
              <h2>Safety & Ratings</h2>

              {project.safety && (
                <>
                  <div className="safety-ratings">
                    <div className="rating-box">
                      <h3>GNCAP Rating</h3>
                      <p className="rating-value">{project.safety.gncap_rating}</p>
                      <p className="rating-detail">{project.safety.gncap_score}</p>
                    </div>
                    <div className="rating-box">
                      <h3>Airbags</h3>
                      <p className="rating-value">{project.safety.airbags}</p>
                    </div>
                  </div>

                  <div className="section-divider"></div>

                  {project.safety.safetyTechs && (
                    <>
                      <h3>Safety Technologies</h3>
                      <ul className="features-list">
                        {project.safety.safetyTechs.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              )}
            </section>
          )}

          {/* Gallery */}
          {activeTab === "Gallery" && project.gallery && (
            <section className="tab-pane">
              <h2>Photo Gallery</h2>
              <div className="gallery-tabs">
                <button
                  className={`gallery-tab ${selectedGallery === "exterior" ? "active" : ""}`}
                  onClick={() => setSelectedGallery("exterior")}
                >
                  Exterior
                </button>
                <button
                  className={`gallery-tab ${selectedGallery === "interior" ? "active" : ""}`}
                  onClick={() => setSelectedGallery("interior")}
                >
                  Interior
                </button>
              </div>

              <div className="gallery-grid">
                {(selectedGallery === "exterior"
                  ? project.gallery.exterior
                  : project.gallery.interior
                )?.map((img, i) => (
                  <div key={i} className="gallery-item">
                    <img src={img} alt={`Gallery ${i}`} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Compare */}
          {activeTab === "Compare" && project.comparison && (
            <section className="tab-pane">
              <h2>Compare with Competitors</h2>
              <table className="data-table comparison-table">
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Price (â‚¹L)</th>
                    <th>Mileage (kmpl)</th>
                    <th>Safety Rating</th>
                    <th>Power (HP)</th>
                    <th>Features Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {project.comparison.map((c, i) => (
                    <tr key={i} className={c.model === project.name ? "highlight-row" : ""}>
                      <td><strong>{c.model}</strong></td>
                      <td>{c.price}</td>
                      <td>{c.mileage}</td>
                      <td><span className="badge">{c.safety}</span></td>
                      <td>{c.power}</td>
                      <td><span className="badge">{c.features || 0}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {comparisonChartData.length > 0 && (
                <div className="chart-wrapper">
                  <h3>Price vs Power Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={comparisonChartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="model" angle={-45} textAnchor="end" height={100} />
                      <YAxis yAxisId="left" label={{ value: "Price (â‚¹L)", angle: -90, position: "insideLeft" }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: "Power (HP)", angle: 90, position: "insideRight" }} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="price" stroke="#1f3a93" name="Price (â‚¹L)" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="power" stroke="#ff6b35" name="Power (HP)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>
          )}

          {/* Dealer & Test Drive */}
          {activeTab === "Dealer & Test Drive" && (
            <section className="tab-pane">
              <h2>Dealer & Test Drive</h2>

              {project.dealers && project.dealers.length > 0 && (
                <>
                  <div className="city-selector">
                    <label>Select City:</label>
                    <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                      {[...new Set(project.dealers.map(d => d.city))].map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div className="section-divider"></div>

                  <h3>Authorized Dealers in {selectedCity}</h3>
                  <table className="data-table dealers-table">
                    <thead>
                      <tr>
                        <th>Dealer Name</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Hours</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDealers.map((d, i) => (
                        <tr key={i}>
                          <td><strong>{d.name}</strong></td>
                          <td>{d.address}</td>
                          <td>{d.phone}</td>
                          <td>{d.hours}</td>
                          <td><button className="btn-small">Book Test Drive</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredDealers.length === 0 && (
                    <p className="no-data">No dealers found in {selectedCity}. Please select another city.</p>
                  )}
                </>
              )}
            </section>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

