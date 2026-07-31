import mysql from 'mysql2';
import dotenv from 'dotenv'; 
dotenv.config(); 
// ✅ Debug: Dekho kya aa raha hai console.log('\n=== DEBUG INFO ==='); 
console.log('DB_HOST:', process.env.DB_HOST); 
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD); 
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('==================\n'); 
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("MySQL Connection Pool Ready ✅");
