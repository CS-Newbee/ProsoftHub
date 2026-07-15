import express from 'express';
import { db } from '../server.js';

const router = express.Router();

const formatDateForMySQL = (isoDateString) => {
  if (!isoDateString) return null;
  try {
    const dateObject = new Date(isoDateString);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    return isoDateString;
  }
};

// ➤ GET ALL EVENTS
router.get('/', (req, res) => {
  db.query("SELECT * FROM events", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// ✅ GET EVENTS BY ADVISOR
router.get('/advisor/:advisor_id', (req, res) => {
  const { advisor_id } = req.params;
  db.query("SELECT * FROM events WHERE advisor_id = ? ORDER BY id DESC", [advisor_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// ➤ ADD NEW EVENT — ✅ advisor_id add kiya
router.post('/', (req, res) => {
  const { title, date, time, venue, description, status, image, capacity, registered, organizer, advisor_id } = req.body;
  const formattedDate = formatDateForMySQL(date);

  const query = `
    INSERT INTO events (title, date, time, venue, description, status, image, capacity, registered, organizer, advisor_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [title, formattedDate, time, venue, description, status, image, capacity, registered || 0, organizer, advisor_id], (err, result) => {
    if (err) {
      console.error("Error adding event:", err);
      return res.status(500).json({ error: err.message });
    }
    db.query("SELECT * FROM events WHERE id=?", [result.insertId], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(rows[0]);
    });
  });
});

// ➤ UPDATE EVENT
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, date, time, venue, description, status, image, capacity, registered, organizer } = req.body;
  const formattedDate = formatDateForMySQL(date);

  const query = `
    UPDATE events
    SET title=?, date=?, time=?, venue=?, description=?, status=?, image=?, capacity=?, registered=?, organizer=?
    WHERE id=?`;

  db.query(query, [title, formattedDate, time, venue, description, status, image, capacity, registered, organizer, id], (err) => {
    if (err) {
      console.error("Error updating event:", err);
      return res.status(500).json({ error: err.message });
    }
    db.query("SELECT * FROM events WHERE id=?", [id], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(rows[0]);
    });
  });
});

// ➤ POSTPONE EVENT
router.put('/:id/postpone', (req, res) => {
  const { id } = req.params;
  db.query("UPDATE events SET status='postponed' WHERE id=?", [id], (err) => {
    if (err) {
      console.error("Error postponing event:", err);
      return res.status(500).json({ error: err.message });
    }
    db.query("SELECT * FROM events WHERE id=?", [id], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(rows[0]);
    });
  });
});

// ➤ DELETE EVENT
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM events WHERE id=?", [id], (err) => {
    if (err) {
      console.error("Error deleting event:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Event deleted!", id });
  });
});

export default router;