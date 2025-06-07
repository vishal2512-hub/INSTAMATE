"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _conversations = require("../controller/conversations.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.post("/findOrCreate", _conversations.findOrCreateConversation);
router.get("/conversation/:conversationId", _conversations.getConversation);
router.get("/user/:userId", _conversations.getUserConversations);
var _default = router;
exports["default"] = _default;