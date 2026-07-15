import { db } from '../config/db.js';

/* ✅ CREATE EVENT */
export const createEvent = (req, res) => {
  const { title, date, time, venue, description, status, image, capacity, organizer, advisor_id } = req.body;

  if (!title || !date || !time || !venue || !description || !advisor_id) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  const sql = `INSERT INTO events 
    (title, date, time, venue, description, status, image, capacity, organizer, advisor_id, registered) 
    VALUES (?,?,?,?,?,?,?,?,?,?,0)`;

  db.query(sql, [title, date, time, venue, description, status, image, capacity, organizer, advisor_id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB Error", error: err });
    res.status(201).json({ ...req.body, id: result.insertId });
  });
};

/* ✅ GET ALL EVENTS BY ADVISOR */
export const getEventsByAdvisor = (req, res) => {
  const { advisor_id } = req.params;
  const sql = `SELECT * FROM events WHERE advisor_id = ? ORDER BY id DESC`;

  db.query(sql, [advisor_id], (err, results) => {
    if (err) return res.status(500).json({ message: "DB Error", error: err });
    res.json(results);
  });
};

/* ✅ UPDATE EVENT */
export const updateEvent = (req, res) => {
  const { id } = req.params;
  const { title, date, time, venue, description, status, image, capacity, organizer } = req.body;

  const sql = `UPDATE events SET title=?, date=?, time=?, venue=?, description=?, status=?, image=?, capacity=?, organizer=? WHERE id=?`;

  db.query(sql, [title, date, time, venue, description, status, image, capacity, organizer, id], (err) => {
    if (err) return res.status(500).json({ message: "DB Error", error: err });
    res.json({ id: Number(id), ...req.body });
  });
};

/* ✅ DELETE EVENT */
export const deleteEvent = (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM events WHERE id=?`;

  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "DB Error", error: err });
    res.json({ message: "Event deleted", id: Number(id) });
  });
};

/* ✅ POSTPONE EVENT */
export const postponeEvent = (req, res) => {
  const { id } = req.params;
  const sql = `UPDATE events SET status='postponed' WHERE id=?`;

  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "DB Error", error: err });

    // Send back the updated event
    const selectSql = `SELECT * FROM events WHERE id=?`;
    db.query(selectSql, [id], (err, results) => {
      if (err) return res.status(500).json({ message: "DB Error", error: err });
      res.json(results[0]);
    });
  });
};

/* ✅ REGISTER MEMBER FOR EVENT */
export const registerEvent = (req, res) => {
  const { event_id } = req.params;
  const { name, email, department, semester } = req.body;

  if (!name || !email || !department || !semester) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (department !== "CS") {
    return res.status(400).json({ message: "Only CS students can register" });
  }

  const paymentAmount = 200; // Fixed payment

  // Insert into members table
  const sql = `INSERT INTO members 
    (event_id, name, email, department, semester, payment) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [event_id, name, email, department, semester, paymentAmount], (err, result) => {
    if (err) return res.status(500).json({ message: "DB Error", error: err });

    // Update event's registered count
    const updateEvent = `UPDATE events SET registered = registered + 1 WHERE id = ?`;
    db.query(updateEvent, [event_id], (err2) => {
      if (err2) console.error("Failed to update registered count:", err2);
      res.status(201).json({ message: "Registered successfully!", payment: paymentAmount });
    });
  });
};
