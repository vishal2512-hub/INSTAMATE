"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteMessage = exports.sendMessage = exports.getMessages = void 0;

var _connect = require("../connect.js");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// ✅ Get messages
var getMessages = function getMessages(req, res) {
  var conversationId, parsedConversationId, _ref, _ref2, messages;

  return regeneratorRuntime.async(function getMessages$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          conversationId = req.params.conversationId; // Ensure conversationId is a valid number

          parsedConversationId = parseInt(conversationId, 10);

          if (!isNaN(parsedConversationId)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "Invalid conversation ID"
          }));

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(_connect.db.promise().query("SELECT m.id, m.text, m.created_at, m.sender_id, u.username AS sender_username\n       FROM messages m\n       JOIN users u ON m.sender_id = u.id\n       WHERE m.conversation_id = ?\n       ORDER BY m.created_at ASC", [parsedConversationId]));

        case 7:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 1);
          messages = _ref2[0];

          if (messages) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", res.status(200).json([]));

        case 12:
          res.status(200).json(messages);
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          console.error("Error in getMessages:", _context.t0);
          res.status(500).json({
            message: "Error fetching messages",
            error: _context.t0.message
          });

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
}; // ✅ Send message


exports.getMessages = getMessages;

var sendMessage = function sendMessage(req, res) {
  var _req$body = req.body,
      conversationId = _req$body.conversationId,
      senderId = _req$body.senderId,
      text = _req$body.text;
  var q = "\n    INSERT INTO messages (conversation_id, sender_id, text, created_at) \n    VALUES (?, ?, ?, NOW())\n  ";

  _connect.db.query(q, [conversationId, senderId, text], function (err) {
    if (err) {
      console.error("Error in sendMessage:", err);
      return res.status(500).json("Error sending message.");
    }

    res.status(200).json("Message sent successfully.");
  });
}; // ✅ Delete message


exports.sendMessage = sendMessage;

var deleteMessage = function deleteMessage(req, res) {
  var messageId = req.params.id;
  var token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!"); // Only the sender can delete their own message

  _jsonwebtoken["default"].verify(token, "secretkey", function (err, userInfo) {
    if (err) return res.status(403).json("Token is not valid!");
    var q = "DELETE FROM messages WHERE id = ? AND sender_id = ?";

    _connect.db.query(q, [messageId, userInfo.id], function (err, data) {
      if (err) return res.status(500).json("Failed to delete message");
      if (data.affectedRows > 0) return res.status(200).json("Message deleted.");
      return res.status(403).json("You can delete only your own message");
    });
  });
};

exports.deleteMessage = deleteMessage;