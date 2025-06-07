import express from "express";

const app= express()


import userRoutes from "./routes/users.js"
import authRoutes from "./routes/auth.js"
import commentRoute from './routes/comments.js'
import postRoutes from './routes/posts.js'
import likeRoute from './routes/likes.js'
import relationshipRoute from './routes/relationship.js'
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import notificationRoute from './routes/notification.js';
import conversationsRoute from "./routes/conversation.js";
import messagesRoute from "./routes/message.js";
import storyRoutes from "./routes/stories.js"; // Correct Path

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
  });
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000", // Your frontend URL
  credentials: true, // Allow credentials
}));
app.use(cookieParser());


// multer middleware defined for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/social-media/public/upload');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
})

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single('file'), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

console.log("i am in index page")
app.use("/api/users",userRoutes)
app.use("/api/notifications", notificationRoute)
app.use("/api/auth",authRoutes)
app.use("/api/comments",commentRoute)
app.use("/api/posts",postRoutes)
app.use("/api/likes",likeRoute)
app.use("/api/relationships", relationshipRoute)
app.use("/api/stories", storyRoutes);
app.use("/api/conversations", conversationsRoute);
app.use("/api/messages", messagesRoute); 

app.listen(8801, () => {
    console.log("API working");
})