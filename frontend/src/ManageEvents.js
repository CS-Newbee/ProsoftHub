import React, { useState, useEffect } from "react";
import "./ManageEvents.css";

function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // ✅ advisor_id localStorage se lo — hardcoded nahi
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const ADVISOR_ID = user.id;

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    description: "",
    status: "upcoming",
    image: "",
    capacity: 50,
    organizer: "",
    registered: 0,
  });

  const API_URL = "http://localhost:5000/api/events";

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/advisor/${ADVISOR_ID}`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    if (ADVISOR_ID) fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.date || !formData.time || !formData.venue || !formData.description) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (editingEvent) {
        // UPDATE
        const res = await fetch(`${API_URL}/${editingEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const updatedEvent = await res.json();
        setEvents(events.map((e) => Number(e.id) === Number(updatedEvent.id) ? updatedEvent : e));
      } else {
        // ✅ CREATE — advisor_id include karo
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            registered: 0,
            advisor_id: ADVISOR_ID,  // ✅ yahan bhejo
          }),
        });
        const newEvent = await res.json();
        setEvents([...events, newEvent]);
      }
      resetForm();
    } catch (err) {
      console.error("Error submitting event:", err);
      alert("Failed to save event. Check if backend is running.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "", date: "", time: "", venue: "",
      description: "", status: "upcoming",
      image: "", capacity: 50, organizer: "", registered: 0,
    });
    setEditingEvent(null);
    setShowModal(false);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData(event);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setEvents(events.filter((e) => Number(e.id) !== Number(id)));
  };

  const handlePostpone = async (id) => {
    const res = await fetch(`${API_URL}/${id}/postpone`, { method: "PUT" });
    const postponedEvent = await res.json();
    setEvents(events.map((e) => Number(e.id) === Number(postponedEvent.id) ? postponedEvent : e));
  };

  // ✅ Date format: 2025-01-15 → Jan 15, 2025
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  // ✅ Time format: 09:30 → 9:30 AM
  const formatTime = (time) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
  };

  const getStatusClass = (status) => `status-${status}`;
  const getStatIconClass = (status) => `stat-${status}`;

  return (
    <div className="events-container">
      {/* HEADER */}
      <div className="events-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Events Management</h1>
            <p>Manage all ProSoft Hub events</p>
          </div>
          <button onClick={() => setShowModal(true)} className="add-event-btn">
            ➕ Add New Event
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-container">
        {["upcoming", "ongoing", "completed", "postponed"].map((status) => (
          <div key={status} className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <p>{status}</p>
                <h3>{events.filter((e) => e.status === status).length}</h3>
              </div>
              <div className={`stat-icon ${getStatIconClass(status)}`}>
                {status === "upcoming" && "📅"}
                {status === "ongoing" && "⚡"}
                {status === "completed" && "✅"}
                {status === "postponed" && "⏸️"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EVENTS GRID */}
      <div className="events-grid">
        {events.length === 0 ? (
          <div className="empty-state">
            <h3>No Events Yet</h3>
            <p>Click "Add New Event" to create your first event</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-image">
                <img
                  src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500"}
                  alt="event"
                />
                <div className={`event-status ${getStatusClass(event.status)}`}>
                  {event.status}
                </div>
              </div>

              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>

                <div className="event-details">
                  <div className="event-detail-item">
                    <span className="event-detail-icon">📅</span>
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="event-detail-item">
                    <span className="event-detail-icon">⏰</span>
                    <span>{formatTime(event.time)}</span>
                  </div>
                  <div className="event-detail-item">
                    <span className="event-detail-icon">📍</span>
                    <span>{event.venue}</span>
                  </div>
                  {event.organizer && (
                    <div className="event-detail-item">
                      <span className="event-detail-icon">👤</span>
                      <span>{event.organizer}</span>
                    </div>
                  )}
                  <div className="event-detail-item">
                    <span className="event-detail-icon">👥</span>
                    <span>Capacity: {event.capacity}</span>
                  </div>
                </div>

                <p className="event-description">{event.description}</p>

                <div className="event-actions">
                  <button onClick={() => handleEdit(event)} className="event-btn btn-edit">✏️ Edit</button>
                  {event.status === "upcoming" && (
                    <button onClick={() => handlePostpone(event.id)} className="event-btn btn-postpone">⏸️ Postpone</button>
                  )}
                  <button onClick={() => handleDelete(event.id)} className="event-btn btn-delete">🗑️ Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingEvent ? "Edit Event" : "Add New Event"}</h2>
              <button onClick={resetForm} className="close-btn">×</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Event Title <span className="required">*</span></label>
                <input name="title" className="form-input" value={formData.title} onChange={handleInputChange} placeholder="Enter event title" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date <span className="required">*</span></label>
                  <input type="date" name="date" className="form-input" value={formData.date} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Time <span className="required">*</span></label>
                  <input type="time" name="time" className="form-input" value={formData.time} onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-group">
                <label>Venue <span className="required">*</span></label>
                <input name="venue" className="form-input" value={formData.venue} onChange={handleInputChange} placeholder="Enter venue location" />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input name="image" className="form-input" value={formData.image} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
              </div>

              <div className="form-group">
                <label>Capacity</label>
                <input type="number" name="capacity" className="form-input" value={formData.capacity} onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <label>Organizer</label>
                <input name="organizer" className="form-input" value={formData.organizer} onChange={handleInputChange} placeholder="Enter organizer name" />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select name="status" className="form-select" value={formData.status} onChange={handleInputChange}>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="postponed">Postponed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description <span className="required">*</span></label>
                <textarea name="description" className="form-textarea" value={formData.description} onChange={handleInputChange} placeholder="Enter event description" />
              </div>

              <div className="modal-actions">
                <button onClick={handleSubmit} className="submit-btn">
                  {editingEvent ? "Update Event" : "Create Event"}
                </button>
                <button onClick={resetForm} className="cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageEvents;
