import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "growtechnologies.in",     // or mysql.growtechnologies.in
  user: "growtechnologies_viha",
  password: "growtechnologies_viha",
  database: "growtechnologies_viha",
  port: 3306,
});
