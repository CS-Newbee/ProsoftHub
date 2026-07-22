import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import memberRoutes from './routes/MemberRoutes.js';
import manageGalleryRoutes from "./routes/ManageGalleryRoutes.js";
dotenv.config();

// MySQL Connection
export const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect((err) => {
  if (err) {
    console.error("❌ Full DB Error:", err);
    process.exit(1);
  }

  console.log("✅ MySQL connected!");
});

const app = express();

const allowedOrigins = [
  'https://prosoft-hub-qn4o.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.CORS_ORIGIN,
].filter(Boolean);

// ⭐ VERY IMPORTANT: ALLOW FRONTEND
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());
app.use("/api/gallery", manageGalleryRoutes);
// Existing Routes
app.use('/api/auth', authRoutes);
app.use("/api/events", eventRoutes);

// 2. Naya Membership Route Register Karein
app.use('/api/members', memberRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});