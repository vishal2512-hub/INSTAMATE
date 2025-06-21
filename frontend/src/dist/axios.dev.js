"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeRequest = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var makeRequest = _axios["default"].create({
  baseURL: "https://vishal2512-hub.github.io",
  withCredentials: true // 🔥 This allows sending cookies

});

exports.makeRequest = makeRequest;