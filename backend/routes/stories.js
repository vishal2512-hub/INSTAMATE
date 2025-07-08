
import express from "express";
import multer from "multer";
import { getStories, addStory, deleteStory } from "../controller/story.js";

const router = express.Router();

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  }
});

const upload = multer({ storage });

// ✅ Fetch stories
router.get("/", getStories);

// ✅ Add a new story with image upload
router.post("/", upload.single("file"), addStory);

// ✅ Delete a story
router.delete("/:id", deleteStory);

export default router;
