"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _messages = require("../controller/messages.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// backend/routes/message.js
var router = _express["default"].Router();

router.get("/:conversationId", _messages.getMessages);
router.post("/", _messages.sendMessage);
router["delete"]("/:id", _messages.deleteMessage);
var _default = router;
exports["default"] = _default;