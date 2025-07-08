"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _post = require("../controller/post.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.get("/", _post.getPosts);
router.post("/", _post.addPost);
router["delete"]("/:id", _post.deletePost);
var _default = router;
exports["default"] = _default;