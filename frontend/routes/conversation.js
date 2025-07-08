import express from "express";
import {
  findOrCreateConversation,
  getConversation,
  getUserConversations,
} from "../controller/conversations.js";

const router = express.Router();

router.post("/findOrCreate", findOrCreateConversation);

router.get("/conversation/:conversationId", getConversation);

router.get("/user/:userId", getUserConversations);

export default router;
