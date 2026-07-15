import mysql from 'mysql2';

console.log('Testing MySQL connection...\n');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '$weetDb#0me',  // ✅ Naya simple password
  database: 'mydatabase',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error("❌ Connection failed:");
    console.error("Error:", err.message);
  } else {
    console.log("✅ MySQL connected successfully!");
    db.end();
  }
});