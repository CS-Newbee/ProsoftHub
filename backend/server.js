import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
// 1. Naya member route import karein
import memberRoutes from './routes/memberRoutes.js'; 

dotenv.config();

// MySQL Connection
export const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '$weetDb#0me',
  database: 'mydatabase',
  port: 3307
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB Error:", err.message);
    process.exit(1);
  } else {
    console.log("✅ MySQL connected!");
  }
});

const app = express();

// ⭐ VERY IMPORTANT: ALLOW FRONTEND
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST','PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Existing Routes
app.use('/api/auth', authRoutes);
app.use("/api/events", eventRoutes);

// 2. Naya Membership Route Register Karein
app.use('/api/members', memberRoutes); 

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});