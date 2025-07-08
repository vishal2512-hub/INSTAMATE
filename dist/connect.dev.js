"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.db = void 0;

var _mysql = _interopRequireDefault(require("mysql2"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// backend/connect.js
_dotenv["default"].config();

var db = _mysql["default"].createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 3306 // ✅ Usually 3306 (confirm it)

});

exports.db = db;
db.connect(function (err) {
  if (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  } else {
    console.log("Connected to the database successfully!");
  }
});