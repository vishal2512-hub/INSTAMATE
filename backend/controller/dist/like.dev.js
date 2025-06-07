"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteLike = exports.addLike = exports.getLikes = void 0;

var _connect = require("../connect.js");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getLikes = function getLikes(req, res) {
  var q = "SELECT userId FROM likes WHERE postId = ?";

  _connect.db.query(q, [req.query.postId], function (err, data) {
    if (err) return res.status(500).json(err); // ❌ Galti: `likesData` ko define nahi kiya gaya

    return res.status(200).json(likesData);
  });
}; // ADD Like


exports.getLikes = getLikes;

var addLike = function addLike(req, res) {
  var token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  _jsonwebtoken["default"].verify(token, "secretkey", function (err, userInfo) {
    if (err) return res.status(403).json("Token is not valid!");
    var checkQuery = "SELECT COUNT(*) AS likeCount FROM likes WHERE userId = ? AND postId = ?";

    _connect.db.query(checkQuery, [userInfo.id, req.body.postId], function (err, result) {
      if (err) return res.status(500).json(err);

      if (result.length > 0 && result[0].likeCount > 0) {
        return res.status(200).json("Already liked");
      }

      var insertQuery = "INSERT INTO likes(`userId`, `postId`) VALUES (?, ?)";

      _connect.db.query(insertQuery, [userInfo.id, req.body.postId], function (err, data) {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Like added successfully");
      });
    });
  });
}; // DELETE Like
// DELETE Like


exports.addLike = addLike;

var deleteLike = function deleteLike(req, res) {
  var token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  _jsonwebtoken["default"].verify(token, "secretkey", function (err, userInfo) {
    if (err) return res.status(403).json("Token is not valid!");
    var q = "DELETE FROM likes WHERE userId = ? AND postId = ?";

    _connect.db.query(q, [userInfo.id, req.body.postId], function (err, data) {
      // ✅ Fix: req.body.postId
      if (err) return res.status(500).json(err);
      return res.status(200).json("Like removed successfully");
    });
  });
};

exports.deleteLike = deleteLike;