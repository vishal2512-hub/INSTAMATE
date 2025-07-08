// backend/routes/message.js
import express from "express";
import { getMessages, sendMessage, deleteMessage } from "../controller/messages.js";

const router = express.Router();

router.get("/:conversationId", getMessages);
router.post("/", sendMessage);
router.delete("/:id", deleteMessage);

export default router;