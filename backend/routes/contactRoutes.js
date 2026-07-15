import express from "express";
import { db } from "../server.js";

const router = express.Router();

router.post("/send", (req, res) => {
  const { name, phone, message } = req.body;

  // validation
  if (!name || !phone || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO contacts (name, phone, message) VALUES (?, ?, ?)";
  db.query(sql, [name, phone, message], (err) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(201).json({ message: "Message sent successfully ✅" });
  });
});

export default router;
