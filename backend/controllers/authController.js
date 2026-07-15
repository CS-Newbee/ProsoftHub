import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db } from "../server.js";


// =========================
// REGISTER USER
// =========================
export const registerUser = async (req, res) => {

  const { name, email, password, confirm_password, role } = req.body;

  if (!name || !email || !password || !confirm_password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ message: "Passwords do not match!" });
  }

  const normalizedEmail = email.toLowerCase();

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [normalizedEmail],
    async (err, result) => {

      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (result.length > 0) {
        return res.status(400).json({ message: "User already exists!" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
        [name, normalizedEmail, hashedPassword, role || "member"],
        (err, data) => {

          if (err) {
            return res.status(500).json({ message: "Insert error", error: err });
          }

          const token = jwt.sign(
            { id: data.insertId, role: role || "member" },
            "rootkey",
            { expiresIn: "7d" }
          );

          res.status(201).json({
            message: "Signup Successful ✅",
            token
          });

        }
      );

    }
  );

};



// =========================
// LOGIN USER
// =========================
export const loginUser = async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const normalizedEmail = email.toLowerCase();

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [normalizedEmail],
    async (err, result) => {

      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (result.length === 0) {
        return res.status(401).json({ message: "Invalid Email or Password ❌" });
      }

      const user = result[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Wrong password ❌" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        "rootkey",
        { expiresIn: "7d" }
      );

      res.status(200).json({
        message: "Login Successful ✅",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });

    }
  );

};