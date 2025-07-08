"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deletePost = exports.addPost = exports.getPosts = void 0;

var _connect = require("../connect.js");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getPosts = function getPosts(req, res) {
  var userId = req.query.userId;
  console.log("Cookies received:", req.cookies); // 🔍 Add this

  var token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  _jsonwebtoken["default"].verify(token, "secretkey", function (err, userInfo) {
    if (err) return res.status(403).json("Token is not valid!");
    var q;
    var values;

    if (userId) {
      // If userId is provided, get posts for that specific user
      q = "\n        SELECT p.*, u.id AS userId, u.name, u.profilePic,\n        COUNT(DISTINCT l.id) as likesCount,\n        COUNT(DISTINCT c.id) as commentsCount\n        FROM posts AS p \n        JOIN users AS u ON (u.id = p.userId)\n        LEFT JOIN likes AS l ON (l.postId = p.id)\n        LEFT JOIN comments AS c ON (c.postId = p.id)\n        WHERE p.userId = ? \n        GROUP BY p.id\n        ORDER BY p.createdAt DESC";
      values = [userId];
    } else {
      // If no userId, get all posts with relationship info
      q = "\n        SELECT DISTINCT p.*, u.id AS userId, u.name, u.profilePic,\n        COUNT(DISTINCT l.id) as likesCount,\n        COUNT(DISTINCT c.id) as commentsCount,\n        CASE \n          WHEN r.followerUserId = ? THEN TRUE \n          ELSE FALSE \n        END as isFollowing\n        FROM posts AS p \n        JOIN users AS u ON (u.id = p.userId)\n        LEFT JOIN relationships AS r ON (p.userId = r.followedUserId AND r.followerUserId = ?)\n        LEFT JOIN likes AS l ON (l.postId = p.id)\n        LEFT JOIN comments AS c ON (c.postId = p.id)\n        GROUP BY p.id\n        ORDER BY p.createdAt DESC";
      values = [userInfo.id, userInfo.id];
    }

    console.log("Cookies received:", req.cookies);

    _connect.db.query(q, values, function (err, data) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json("Database error occurred");
      }

      return res.status(200).json(data);
    });
  });
};

exports.getPosts = getPosts;

var addPost = function addPost(req, res) {
  var token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  _jsonwebtoken["default"].verify(token, "secretkey", function (err, userInfo) {
    if (err) return res.status(403).json("Token is not valid!"); // Check if post has content (text, image, or video)

    if (!req.body.desc && !req.body.img && !req.body.video) {
      return res.status(400).json("Post must contain text, image, or video");
    }

    var q = "INSERT INTO posts(`desc`, `img`, `video`, `createdAt`, `userId`) VALUES (?, ?, ?, ?, ?)";
    var values = [req.body.desc || "", // Allow empty description if there's media
    req.body.img || "", // Image URL or empty
    req.body.video || "", // Video URL or empty
    (0, _moment["default"])(Date.now()).format("YYYY-MM-DD HH:mm:ss"), userInfo.id];

    _connect.db.query(q, values, function (err, data) {
      if (err) {
        console.error("Error creating post:", err);
        return res.status(500).json("Failed to create post");
      } // Return the complete post data


      return res.status(200).json({
        id: data.insertId,
        desc: values[0],
        img: values[1],
        video: values[2],
        userId: userInfo.id,
        createdAt: values[3],
        name: userInfo.name,
        profilePic: userInfo.profilePic
      });
    });
  });
};

exports.addPost = addPost;

var deletePost = function deletePost(req, res) {
  var token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  _jsonwebtoken["default"].verify(token, "secretkey", function (err, userInfo) {
    if (err) return res.status(403).json("Token is not valid!");
    var q = "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

    _connect.db.query(q, [req.params.id, userInfo.id], function (err, data) {
      if (err) {
        console.error("Delete error:", err);
        return res.status(500).json("Failed to delete post");
      }

      if (data.affectedRows > 0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post");
    });
  });
};

exports.deletePost = deletePost;