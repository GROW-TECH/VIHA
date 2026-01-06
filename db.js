import mysql from "mysql2/promise";

// configure your DB
export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "199625@viji",
  database: "viha",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port:3307
});


