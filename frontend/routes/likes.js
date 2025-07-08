import express from "express";
import { getLikes, addLike, deleteLike } from "../controller/like.js";

const router = express.Router();

router.get("/", getLikes);
router.post("/", addLike);
router.delete("/", deleteLike); // Change to use req.body for postId

export default router;
