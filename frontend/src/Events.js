import React, { useState, useEffect } from "react";
import "./Events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [filterStatus, setFilterStatus] = useState("upcoming");
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/events";

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ✅ Date format: 2025-01-15 → Jan 15, 2025
  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  // ✅ Time format: 09:30:00 → 9:30 AM
  const formatTime = (time) => {
    if (!time) return "—";
    const parts = time.split(":");
    const hour = parseInt(parts[0]);
    const min = parts[1];
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${min} ${ampm}`;
  };

  const filteredEvents = filterStatus === "all"
    ? events
    : events.filter(e => e.status?.toLowerCase() === filterStatus.toLowerCase());

  return (
    <div className="animated-page-wrapper">
      <div className="background-blob top-left"></div>
      <div className="background-blob bottom-right"></div>

      <header className="image-header">
        <h1 className="animated-neon-title">UNLEASH YOUR POTENTIAL: EXPLORE EVENTS</h1>

        <div className="pill-filter-wrapper">
          <div className="filter-pill-box">
            <span className="filter-label">FILTER BY STATUS:</span>
            <select
              className="image-dropdown-style"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Events</option>
              <option value="ongoing">Ongoing</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="postponed">Postponed</option>
            </select>
          </div>
        </div>
      </header>

      <main className="content-area">
        {loading ? (
          <div className="empty-state">⏳ Loading events...</div>
        ) : (
          <div className="events-grid-view">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div key={event.id} className="premium-event-card">
                  <div className="card-image-wrap">
                    <img
                      src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500"}
                      alt="event"
                    />
                    <div className={`status-badge-neon ${event.status?.toLowerCase()}`}>
                      {event.status?.toUpperCase()}
                    </div>
                    {event.status?.toLowerCase() === "ongoing" && (
                      <div className="live-indicator">● LIVE</div>
                    )}
                  </div>

                  <div className="card-body">
                    <h3 className="event-name-title">{event.title}</h3>
                    <div className="event-stats">
                      {/* ✅ formatDate aur formatTime use kar rahe hain */}
                      <p>📅 <b>Date:</b> {formatDate(event.date)}</p>
                      <p>⏰ <b>Time:</b> {formatTime(event.time)}</p>
                      <p>📍 <b>Venue:</b> {event.venue || "—"}</p>
                      <p>👤 <b>Organizer:</b> {event.organizer || "ProSoft Hub"}</p>
                      <p>👥 <b>Capacity:</b> {event.capacity} | <b>Reg:</b> {event.registered}</p>
                    </div>
                    <div className="divider"></div>
                    <p className="event-desc">{event.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">No {filterStatus} events found.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Events;
