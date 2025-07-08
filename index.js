import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import path from "path";

import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import commentRoute from "./routes/comments.js";
import postRoutes from "./routes/posts.js";
import likeRoute from "./routes/likes.js";
import relationshipRoute from "./routes/relationship.js";
import notificationRoute from "./routes/notification.js";
import conversationsRoute from "./routes/conversation.js";
import messagesRoute from "./routes/message.js";
import storyRoutes from "./routes/stories.js";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());

const allowedOrigins = [
  "https://instamate87.onrender.com/",
  "https://vishal2512-hub.github.io",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);



app.use(cookieParser());
const __dirname = path.resolve();


app.use("/upload", express.static("../frontend/public/upload"));

// ✅ Multer setup for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json("No file uploaded");
  res.status(200).json({ filename: file.originalname });
});

app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoute);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoute);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoute);
app.use("/api/relationships", relationshipRoute);
app.use("/api/stories", storyRoutes);
app.use("/api/conversations", conversationsRoute);
app.use("/api/messages", messagesRoute);

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("API working on port", PORT);
});
