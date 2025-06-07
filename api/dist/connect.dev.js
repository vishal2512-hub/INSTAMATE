"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.db = void 0;

var _mysql = _interopRequireDefault(require("mysql2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// backend/connect.js
var db = _mysql["default"].createConnection({
  host: "localhost",
  user: "root",
  password: "student",
  database: "social"
});

exports.db = db;
db.connect(function (err) {
  if (err) {
    console.error("Database connection error:", err);
    process.exit(1); // Exit if there is a connection issue
  } else {
    console.log("Connected to the database successfully!");
  }
});