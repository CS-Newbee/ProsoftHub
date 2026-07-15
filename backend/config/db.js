import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Debug: Dekho kya aa raha hai
console.log('\n=== DEBUG INFO ===');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('==================\n');

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 3307
});

db.connect((err) => {
  if (err) {
    console.error("DB connection error ❌:", err.message);
  } else {
    console.log("MySQL connected ✅");
  }
});