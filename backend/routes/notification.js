import express from "express";
import { getNotifications, createNotification, markAsRead } from "../controller/notifications.js";

const router = express.Router();

router.get("/", getNotifications);
router.post("/", createNotification);
router.put("/read", markAsRead);

export default router;