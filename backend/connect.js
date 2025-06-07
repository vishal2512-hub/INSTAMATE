// backend/connect.js
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();
export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "student",
  database: "social",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  } else {
    console.log("Connected to the database successfully!");
  }
});
