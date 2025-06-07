"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserConversations = exports.getConversation = exports.findOrCreateConversation = void 0;

var _connect = require("../connect.js");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Find or create a conversation between two users
var findOrCreateConversation = function findOrCreateConversation(req, res) {
  var _req$body, userId1, userId2, parsedUserId1, parsedUserId2, _ref, _ref2, users, _ref3, _ref4, existing, _ref5, _ref6, insertResult, conversationId;

  return regeneratorRuntime.async(function findOrCreateConversation$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, userId1 = _req$body.userId1, userId2 = _req$body.userId2; // <-- Read from req.body now

          parsedUserId1 = parseInt(userId1, 10);
          parsedUserId2 = parseInt(userId2, 10);

          if (!(isNaN(parsedUserId1) || isNaN(parsedUserId2))) {
            _context.next = 6;
            break;
          }

          console.error("Invalid user IDs:", {
            userId1: userId1,
            userId2: userId2
          });
          return _context.abrupt("return", res.status(400).json({
            message: "Invalid user IDs"
          }));

        case 6:
          _context.prev = 6;
          _context.next = 9;
          return regeneratorRuntime.awrap(_connect.db.promise().query("SELECT id FROM users WHERE id IN (?, ?)", [parsedUserId1, parsedUserId2]));

        case 9:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 1);
          users = _ref2[0];

          if (!(users.length !== 2)) {
            _context.next = 14;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "Users not found: ".concat(parsedUserId1, ", ").concat(parsedUserId2)
          }));

        case 14:
          _context.next = 16;
          return regeneratorRuntime.awrap(_connect.db.promise().query("SELECT c.id \n       FROM conversations c\n       JOIN conversation_members cm1 ON c.id = cm1.conversation_id\n       JOIN conversation_members cm2 ON c.id = cm2.conversation_id\n       WHERE cm1.user_id = ? AND cm2.user_id = ? LIMIT 1", [parsedUserId1, parsedUserId2]));

        case 16:
          _ref3 = _context.sent;
          _ref4 = _slicedToArray(_ref3, 1);
          existing = _ref4[0];

          if (!(existing.length > 0)) {
            _context.next = 21;
            break;
          }

          return _context.abrupt("return", res.status(200).json({
            conversationId: existing[0].id
          }));

        case 21:
          _context.next = 23;
          return regeneratorRuntime.awrap(_connect.db.promise().query("INSERT INTO conversations (created_at) VALUES (NOW())"));

        case 23:
          _ref5 = _context.sent;
          _ref6 = _slicedToArray(_ref5, 1);
          insertResult = _ref6[0];
          conversationId = insertResult.insertId; // Add members to conversation

          _context.next = 29;
          return regeneratorRuntime.awrap(_connect.db.promise().query("INSERT INTO conversation_members (conversation_id, user_id)\n       VALUES (?, ?), (?, ?)", [conversationId, parsedUserId1, conversationId, parsedUserId2]));

        case 29:
          res.status(200).json({
            conversationId: conversationId
          });
          _context.next = 36;
          break;

        case 32:
          _context.prev = 32;
          _context.t0 = _context["catch"](6);
          console.error("Error in findOrCreateConversation:", _context.t0);
          res.status(500).json({
            message: "Error finding/creating conversation",
            error: process.env.NODE_ENV === "development" ? _context.t0.stack : _context.t0.message
          });

        case 36:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[6, 32]]);
}; // Get conversation members by conversation ID


exports.findOrCreateConversation = findOrCreateConversation;

var getConversation = function getConversation(req, res) {
  var conversationId, parsedConversationId, _ref7, _ref8, rows;

  return regeneratorRuntime.async(function getConversation$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          conversationId = req.params.conversationId;
          parsedConversationId = parseInt(conversationId, 10);

          if (!isNaN(parsedConversationId)) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Invalid conversation ID"
          }));

        case 5:
          _context2.next = 7;
          return regeneratorRuntime.awrap(_connect.db.promise().query("SELECT cm.user_id, u.username \n       FROM conversation_members cm\n       JOIN users u ON cm.user_id = u.id\n       WHERE cm.conversation_id = ?", [parsedConversationId]));

        case 7:
          _ref7 = _context2.sent;
          _ref8 = _slicedToArray(_ref7, 1);
          rows = _ref8[0];

          if (!(!rows || rows.length === 0)) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "Conversation not found"
          }));

        case 12:
          res.status(200).json(rows);
          _context2.next = 19;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          console.error("Error in getConversation:", _context2.t0);
          res.status(500).json({
            message: "Error fetching conversation",
            error: process.env.NODE_ENV === "development" ? _context2.t0.stack : _context2.t0.message
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 15]]);
}; // Get all conversations for a specific user


exports.getConversation = getConversation;

var getUserConversations = function getUserConversations(req, res) {
  var userId, parsedUserId, _ref9, _ref10, queryResult, groupedConversations;

  return regeneratorRuntime.async(function getUserConversations$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          userId = req.params.userId;
          _context3.prev = 1;
          parsedUserId = parseInt(userId, 10);

          if (!isNaN(parsedUserId)) {
            _context3.next = 6;
            break;
          }

          console.error("Invalid user ID:", userId);
          return _context3.abrupt("return", res.status(400).json({
            message: "Invalid user ID"
          }));

        case 6:
          _context3.next = 8;
          return regeneratorRuntime.awrap(_connect.db.promise().query("\n      SELECT c.id AS conversation_id, cm.user_id, u.username\n      FROM conversations c\n      JOIN conversation_members cm ON c.id = cm.conversation_id\n      JOIN users u ON cm.user_id = u.id\n      WHERE c.id IN (\n        SELECT conversation_id \n        FROM conversation_members \n        WHERE user_id = ?\n      )\n      ORDER BY c.created_at DESC\n      ", [parsedUserId]));

        case 8:
          _ref9 = _context3.sent;
          _ref10 = _slicedToArray(_ref9, 1);
          queryResult = _ref10[0];

          if (!(!queryResult || queryResult.length === 0)) {
            _context3.next = 13;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "No conversations found"
          }));

        case 13:
          // Group members by conversation
          groupedConversations = queryResult.reduce(function (acc, row) {
            var existingConversation = acc.find(function (c) {
              return c.conversation_id === row.conversation_id;
            });

            if (existingConversation) {
              existingConversation.members.push({
                user_id: row.user_id,
                username: row.username
              });
            } else {
              acc.push({
                conversation_id: row.conversation_id,
                members: [{
                  user_id: row.user_id,
                  username: row.username
                }]
              });
            }

            return acc;
          }, []);
          res.status(200).json(groupedConversations);
          _context3.next = 21;
          break;

        case 17:
          _context3.prev = 17;
          _context3.t0 = _context3["catch"](1);
          console.error("Error in getUserConversations:", _context3.t0);
          res.status(500).json({
            message: "Error fetching conversations",
            error: process.env.NODE_ENV === "development" ? _context3.t0.stack : _context3.t0.message
          });

        case 21:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 17]]);
};

exports.getUserConversations = getUserConversations;