import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import "./UserPage.css";

export default function UserPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
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

    fetchCars();
  }, []);

  return (
    <div className="app-wrapper">
      <NavBar />
      <div className="user-page-container">
        <div className="user-header">
          <h1>Tata Cars</h1>
          <p>Explore our collection of premium Tata vehicles</p>
        </div>

        {loading ? (
          <div className="loading">Loading cars...</div>
        ) : (
          <div className="cars-grid">
            {cars.map(car => (
              <div
                key={car.id}
                className="car-card"
                onClick={() => nav(`/project/${car.slug || car.id}`)}
              >
                <div className="car-content">
                  <h2>{car.name}</h2>
                  <p className="car-description">{car.description}</p>
                  <span className={`car-status ${car.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                    {car.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}