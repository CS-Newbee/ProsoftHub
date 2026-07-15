import { db } from '../server.js';

export const getEvents = (req, res) => {
  db.query("SELECT * FROM events", (err, result) => {
    if(err) return res.status(500).json({ error: err });
    res.json(result);
  });
};


