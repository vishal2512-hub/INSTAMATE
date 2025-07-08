"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUser = exports.getUser = void 0;

var _connect = require("../connect.js");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var getUser = function getUser(req, res) {
  console.log("inside find user");
  var userId = req.params.userId;
  var q = "SELECT * FROM users WHERE id=?";

  _connect.db.query(q, [userId], function (err, data) {
    if (err) {
      return res.status(500).json(err);
    }

    var _data$ = data[0],
        password = _data$.password,
        info = _objectWithoutProperties(_data$, ["password"]);

    return res.json(info);
  });
};

exports.getUser = getUser;

var updateUser = function updateUser(req, res) {
  var token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  _jsonwebtoken["default"].verify(token, "secretkey", function (err, userInfo) {
    if (err) return res.status(403).json("Token is not valid!");
    var q = "UPDATE users SET `name`=?, `city`=?, `website`=?, `profilePic`=?, `coverPic`=? WHERE id=?";

    _connect.db.query(q, [req.body.name, req.body.city, req.body.website, req.body.profilePic, // Updated profile picture
    req.body.coverPic, // Updated cover picture
    userInfo.id], function (err, data) {
      if (err) return res.status(500).json(err);

      if (data.affectedRows > 0) {
        return res.json("Profile Updated Successfully!");
      }

      return res.status(403).json("You can update only your profile!");
    });
  });
};

exports.updateUser = updateUser;