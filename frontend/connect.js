import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  } else {
    console.log("Connected to the database successfully!");
  }
});
