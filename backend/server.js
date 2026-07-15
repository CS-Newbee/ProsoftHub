import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import memberRoutes from './routes/MemberRoutes.js';

dotenv.config();

// MySQL Connection
export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
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
  origin: 'https://prosoft-hub-qn4o.vercel.app/',
  methods: ['GET', 'POST','PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Existing Routes
app.use('/api/auth', authRoutes);
app.use("/api/events", eventRoutes);

// 2. Naya Membership Route Register Karein
app.use('/api/members', memberRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});