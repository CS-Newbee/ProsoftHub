import express from 'express';
import { db } from '../config/db.js';

const router = express.Router();

/* =========================
   ADD MEMBER
========================= */
router.post('/register', (req, res) => { 
  const { fullName, email, phone, studentId, department, year, reason } = req.body;

  if (!fullName || !email || !phone || !studentId || !department || !year || !reason) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = `
    INSERT INTO members
    (name, email, phone, studentId, department, semester, reason, status, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'member')
  `;

  db.query(
    sql,
    [fullName, email, phone, studentId, department, year, reason],
    err => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.json({ success: true });
    }
  );
});

/* =========================
   GET MEMBERS
========================= */
router.get('/', (req, res) => {
  let sql = 'SELECT * FROM members WHERE 1=1';
  const params = [];

  if (req.query.status) {
    if (req.query.status === 'approved') sql += ' AND status="active"';
    else if (req.query.status === 'rejected') sql += ' AND status="expired"';
    else sql += ' AND status="pending"';
  }

  if (req.query.department) {
    sql += ' AND department=?';
    params.push(req.query.department);
  }

  if (req.query.year) {
    sql += ' AND semester=?';
    params.push(req.query.year);
  }

  if (req.query.search) {
    sql += ' AND (name LIKE ? OR email LIKE ? OR studentId LIKE ?)';
    params.push(
      `%${req.query.search}%`,
      `%${req.query.search}%`,
      `%${req.query.search}%`
    );
  }

  sql += ' ORDER BY created_at DESC';

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });

    const mapped = rows.map(r => ({
      id: r.id,
      fullName: r.name,
      email: r.email,
      phone: r.phone,
      studentId: r.studentId,
      department: r.department,
      year: r.semester,
      reason: r.reason,
      status:
        r.status === 'active'
          ? 'approved'
          : r.status === 'expired'
          ? 'rejected'
          : 'pending',
      submittedAt: r.created_at
    }));

    res.json({ success: true, data: mapped });
  });
});

/* =========================
   STATS
========================= */
router.get('/stats', (req, res) => {
  const sql = `
    SELECT
      COUNT(*) AS total,
      SUM(status='pending') AS pending,
      SUM(status='active') AS approved,
      SUM(status='expired') AS rejected
    FROM members
  `;

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ success: true, data: rows[0] });
  });
});

/* =========================
   APPROVE / REJECT
========================= */
router.put('/status/:id', (req, res) => {
  const { status } = req.body;

  let dbStatus = 'pending';
  if (status === 'approved') dbStatus = 'active';
  if (status === 'rejected') dbStatus = 'expired';

  db.query(
    'UPDATE members SET status=? WHERE id=?',
    [dbStatus, req.params.id],
    err => {
      if (err) return res.status(500).json({ message: 'Update failed' });
      res.json({ success: true });
    }
  );
});

/* =========================
   DELETE MEMBER
========================= */
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM members WHERE id=?', [req.params.id], err => {
    if (err) return res.status(500).json({ message: 'Delete failed' });
    res.json({ success: true });
  });
});

export default router;
