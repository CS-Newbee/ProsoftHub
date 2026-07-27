import React from "react";
import AdvisorNavbar from "./AdvisorNavbar";
import { useNavigate } from "react-router-dom";
import "./AdvisorDashboard.css";

const AdvisorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="adv-page">

      {/* Advisor Navbar */}
      <AdvisorNavbar />

      {/* Main Content */}
      <div className="adv-main">
        <h2>Advisor Dashboard</h2>
        <p>What would you like to manage?</p>

        <div className="adv-btns">
          <button onClick={() => navigate("/advisor-dashboard/events")}>
            Manage Events
          </button>

          <button onClick={() => navigate("/advisor-dashboard/memberships")}>
            Manage Membership
          </button>

          <button onClick={() => navigate("/advisor-dashboard/gallery")}>
            Manage Gallery
          </button>
        </div>
      </div>

    </div>
  );
};

export default AdvisorDashboard;
