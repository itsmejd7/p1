// src/pages/Dashboard.jsx
import { logout, isAdmin, isUser } from "../auth/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Dashboard() {
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState("Tab1");

  const role = isAdmin() ? "admin" : isUser() ? "user" : "guest";
  const tabs = role === "admin" ? ["Tab1", "Tab2", "Tab3", "Tab4", "Tab5"] : ["Tab1", "Tab2", "Tab3"];

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <div className="dashboard-page">
      <h2>Dashboard ({role})</h2>

      <div className="dashboard-tabs">
        {tabs.map((t) => (
          <button
            key={t}
            className={`tab-button ${activeTab === t ? "active" : ""}`}
            onClick={() => setActiveTab(t)}
            aria-pressed={activeTab === t}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === "Tab1" && (
          <div>
            <h3>Tab 1</h3>
            <p>Content visible to {role} on Tab 1.</p>
          </div>
        )}

        {activeTab === "Tab2" && (
          <div>
            <h3>Tab 2</h3>
            <p>Content visible to {role} on Tab 2.</p>
          </div>
        )}

        {activeTab === "Tab3" && (
          <div>
            <h3>Tab 3</h3>
            <p>Content visible to {role} on Tab 3.</p>
          </div>
        )}

        {role === "admin" && activeTab === "Tab4" && (
          <div>
            <h3>Tab 4 (Admin)</h3>
            <p>Admin-only content and controls.</p>
          </div>
        )}

        {role === "admin" && activeTab === "Tab5" && (
          <div>
            <h3>Tab 5 (Admin)</h3>
            <p>Admin reports and advanced actions.</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}