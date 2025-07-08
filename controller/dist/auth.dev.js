"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logout = exports.login = exports.register = void 0;

var _connect = require("../connect.js");

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// ✅ Register a new user
var register = function register(req, res) {
  var checkQuery = "SELECT * FROM users WHERE username = ?";

  _connect.db.query(checkQuery, [req.body.username], function (err, data) {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    var salt = _bcryptjs["default"].genSaltSync(10);

    var hashedPassword = _bcryptjs["default"].hashSync(req.body.password, salt);

    var insertQuery = "INSERT INTO users (`username`, `email`, `password`, `name`) VALUES (?)";
    var values = [req.body.username, req.body.email, hashedPassword, req.body.name];

    _connect.db.query(insertQuery, [values], function (err) {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
}; // ✅ Login user and send JWT in cookie


exports.register = register;

var login = function login(req, res) {
  var q = "SELECT * FROM users WHERE username = ?";

  _connect.db.query(q, [req.body.username], function (err, data) {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    var isPasswordCorrect = _bcryptjs["default"].compareSync(req.body.password, data[0].password);

    if (!isPasswordCorrect) return res.status(400).json("Wrong password or username!");

    var token = _jsonwebtoken["default"].sign({
      id: data[0].id
    }, "secretkey", {
      expiresIn: "1d"
    });

    var _data$ = data[0],
        password = _data$.password,
        userWithoutPassword = _objectWithoutProperties(_data$, ["password"]);

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false,
      // true in production (HTTPS)
      sameSite: "lax" // "none" in production with HTTPS frontend

    }).status(200).json(userWithoutPassword);
  });
};

exports.login = login;

var logout = function logout(req, res) {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  }).status(200).json("User has been logged out.");
};

exports.logout = logout;