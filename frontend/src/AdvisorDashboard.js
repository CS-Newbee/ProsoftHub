import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdvisorDashboard.css";

const AdvisorDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  const navTo = (path) => {
    navigate(path);
    closeSidebar();
  };

  return (
    <div className="adv-page">

      {/* Hamburger */}
      <div
        className={`adv-ham ${isSidebarOpen ? "adv-ham--open" : ""}`}
        onClick={toggleSidebar}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Home Button */}
      <button className="adv-homebtn" onClick={() => navigate("/")}>
        🏠 HOME
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div className="adv-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar Drawer */}
      <div className={`adv-drawer ${isSidebarOpen ? "adv-drawer--open" : ""}`}>

        {/* Brand Header */}
        <div className="adv-drawer__brand">
          <div className="adv-drawer__brand-icon">⚡</div>
          <div className="adv-drawer__brand-text">
            <div className="adv-drawer__brand-name">Prosoft Hub</div>
            <div className="adv-drawer__brand-role">Advisor Panel</div>
          </div>
          <button className="adv-drawer__close" onClick={closeSidebar}>✕</button>
        </div>

        {/* Navigation */}
        <nav className="adv-drawer__nav">

          <div className="adv-drawer__label">Management</div>

          <div className="adv-drawer__item" onClick={() => navTo("/advisor-dashboard/events")}>
            <div className="adv-drawer__icon">📅</div>
            <span>Manage Events</span>
            <span className="adv-drawer__arrow">›</span>
          </div>

          <div className="adv-drawer__item" onClick={() => navTo("/advisor-dashboard/memberships")}>
            <div className="adv-drawer__icon">👥</div>
            <span>Manage Members</span>
            <span className="adv-drawer__arrow">›</span>
          </div>

          <div className="adv-drawer__item" onClick={() => navTo("/advisor-dashboard/gallery")}>
            <div className="adv-drawer__icon">🖼️</div>
            <span>Manage Gallery</span>
            <span className="adv-drawer__arrow">›</span>
          </div>

          <div className="adv-drawer__hr" />

          <div className="adv-drawer__item" onClick={() => navTo("/")}>
            <div className="adv-drawer__icon">🏠</div>
            <span>Go to Home</span>
            <span className="adv-drawer__arrow">›</span>
          </div>

          <div className="adv-drawer__hr" />

          <div className="adv-drawer__item adv-drawer__item--logout" onClick={() => navTo("/signin")}>
            <div className="adv-drawer__icon">🚪</div>
            <span>Logout</span>
          </div>

        </nav>

        {/* Footer */}
        <div className="adv-drawer__footer">
          <div className="adv-drawer__footer-avatar">A</div>
          <div>
            <div className="adv-drawer__footer-name">Advisor</div>
            <div className="adv-drawer__footer-role">Prosoft Hub</div>
          </div>
        </div>

      </div>

      {/* Main Content */}
      <div className="adv-main">
        <h2>Advisor Dashboard</h2>
        <p>What would you like to manage?</p>
        <div className="adv-btns">
          <button onClick={() => navigate("/advisor-dashboard/events")}>Manage Events</button>
          <button onClick={() => navigate("/advisor-dashboard/memberships")}>Manage Membership</button>
          <button onClick={() => navigate("/advisor-dashboard/gallery")}>Manage Gallery</button>
        </div>
      </div>

    </div>
  );
};

export default AdvisorDashboard;
