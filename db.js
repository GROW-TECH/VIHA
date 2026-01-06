import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",              // ✅ IMPORTANT
  user: "growtechnologies_viha",   // cPanel DB user
  password: "growtechnologies_viha",  // 🔴 NOT db name
  database: "growtechnologies_viha",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
});
