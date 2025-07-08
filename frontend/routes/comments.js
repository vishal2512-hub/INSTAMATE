import express from "express";
import { addComment, getComments } from "../controller/comment.js"; // Update this line
const router = express.Router()

router.get("/",getComments)
router.post("/",addComment)

export default router;