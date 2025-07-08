"use strict";

var _express = _interopRequireDefault(require("express"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _multer = _interopRequireDefault(require("multer"));

var _users = _interopRequireDefault(require("./routes/users.js"));

var _auth = _interopRequireDefault(require("./routes/auth.js"));

var _comments = _interopRequireDefault(require("./routes/comments.js"));

var _posts = _interopRequireDefault(require("./routes/posts.js"));

var _likes = _interopRequireDefault(require("./routes/likes.js"));

var _relationship = _interopRequireDefault(require("./routes/relationship.js"));

var _notification = _interopRequireDefault(require("./routes/notification.js"));

var _conversation = _interopRequireDefault(require("./routes/conversation.js"));

var _message = _interopRequireDefault(require("./routes/message.js"));

var _stories = _interopRequireDefault(require("./routes/stories.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(_express["default"].json()); // ✅ Allowed Origins

var allowedOrigins = ["http://localhost:3000", "https://vishal2512-hub.github.io" // 👈 GitHub Pages URL added
]; // ✅ CORS Config

app.use((0, _cors["default"])({
  origin: function origin(_origin, callback) {
    if (!_origin || allowedOrigins.includes(_origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS Error: Not allowed"));
    }
  },
  credentials: true
}));
app.use((0, _cookieParser["default"])());
app.use("/upload", _express["default"]["static"]("../frontend/public/upload")); // ✅ Multer setup for uploads

var storage = _multer["default"].diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, "../frontend/public/upload");
  },
  filename: function filename(req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = (0, _multer["default"])({
  storage: storage
}); // ✅ Upload route

app.post("/api/upload", upload.single("file"), function (req, res) {
  var file = req.file;
  if (!file) return res.status(400).json("No file uploaded");
  res.status(200).json({
    filename: file.originalname
  });
}); // ✅ API routes

app.use("/api/users", _users["default"]);
app.use("/api/notifications", _notification["default"]);
app.use("/api/auth", _auth["default"]);
app.use("/api/comments", _comments["default"]);
app.use("/api/posts", _posts["default"]);
app.use("/api/likes", _likes["default"]);
app.use("/api/relationships", _relationship["default"]);
app.use("/api/stories", _stories["default"]);
app.use("/api/conversations", _conversation["default"]);
app.use("/api/messages", _message["default"]); // ✅ Start server

app.listen(8801, function () {
  console.log("API working on port 8801");
});