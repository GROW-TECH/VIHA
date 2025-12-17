const mysql = require("mysql2");

// ================= MYSQL CONNECTION =================
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "MySql@1234", // 🔴 your MySQL password
  database: "viha_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ================= TEST CONNECTION =================
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err.message);
  } else {
    console.log("✅ MySQL Connected Successfully");
    connection.release();
  }
});

module.exports = db;
