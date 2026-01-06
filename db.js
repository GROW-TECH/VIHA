import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "l4cp.vnetindia.com",
  user: "growtechnologies_viha",
  password: "growtechnologies_viha",
  database: "growtechnologies_viha",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
});
