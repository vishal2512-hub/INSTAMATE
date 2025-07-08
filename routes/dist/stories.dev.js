"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _multer = _interopRequireDefault(require("multer"));

var _story = require("../controller/story.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // Configure Multer for File Uploads


var storage = _multer["default"].diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, "uploads/"); // Save files to "uploads" folder
  },
  filename: function filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  }
});

var upload = (0, _multer["default"])({
  storage: storage
}); // ✅ Fetch stories

router.get("/", _story.getStories); // ✅ Add a new story with image upload

router.post("/", upload.single("file"), _story.addStory); // ✅ Delete a story

router["delete"]("/:id", _story.deleteStory);
var _default = router;
exports["default"] = _default;