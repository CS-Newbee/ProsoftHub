import mysql from 'mysql2';

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'appuser',
  password: 'apppass123',
  database: 'mydatabase',
  port: 3307
});

console.log('Connecting to 127.0.0.1:3306 with appuser...');

db.connect((err) => {
  if (err) {
    console.error("❌ Error:", err.message);
    console.error("Code:", err.code);
  } else {
    console.log("✅ Success!");
    db.end();
  }
});