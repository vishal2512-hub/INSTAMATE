import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
    console.log("Cookies received:", req.cookies); // 🔍 Add this

  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    let q;
    let values;

    if (userId) {
      q = `
        SELECT p.*, u.id AS userId, u.name, u.profilePic,
        COUNT(DISTINCT l.id) as likesCount,
        COUNT(DISTINCT c.id) as commentsCount
        FROM posts AS p 
        JOIN users AS u ON (u.id = p.userId)
        LEFT JOIN likes AS l ON (l.postId = p.id)
        LEFT JOIN comments AS c ON (c.postId = p.id)
        WHERE p.userId = ? 
        GROUP BY p.id
        ORDER BY p.createdAt DESC`;
      values = [userId];
    } else {
      q = `
        SELECT DISTINCT p.*, u.id AS userId, u.name, u.profilePic,
        COUNT(DISTINCT l.id) as likesCount,
        COUNT(DISTINCT c.id) as commentsCount,
        CASE 
          WHEN r.followerUserId = ? THEN TRUE 
          ELSE FALSE 
        END as isFollowing
        FROM posts AS p 
        JOIN users AS u ON (u.id = p.userId)
        LEFT JOIN relationships AS r ON (p.userId = r.followedUserId AND r.followerUserId = ?)
        LEFT JOIN likes AS l ON (l.postId = p.id)
        LEFT JOIN comments AS c ON (c.postId = p.id)
        GROUP BY p.id
        ORDER BY p.createdAt DESC`;
      values = [userInfo.id, userInfo.id];
    }

          console.log("Cookies received:", req.cookies);

    db.query(q, values, (err, data) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json("Database error occurred");
      }
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    if (!req.body.desc && !req.body.img && !req.body.video) {
      return res.status(400).json("Post must contain text, image, or video");
    }

    const q = "INSERT INTO posts(`desc`, `img`, `video`, `createdAt`, `userId`) VALUES (?, ?, ?, ?, ?)";
    const values = [
      req.body.desc || "",       // Allow empty description if there's media
      req.body.img || "",        // Image URL or empty
      req.body.video || "",      // Video URL or empty
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(q, values, (err, data) => {
      if (err) {
        console.error("Error creating post:", err);
        return res.status(500).json("Failed to create post");
      }

      return res.status(200).json({
        id: data.insertId,
        desc: values[0],
        img: values[1],
        video: values[2],
        userId: userInfo.id,
        createdAt: values[3],
        name: userInfo.name,
        profilePic: userInfo.profilePic
      });
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM posts WHERE `id`=? AND `userId` = ?";
    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) {
        console.error("Delete error:", err);
        return res.status(500).json("Failed to delete post");
      }
      if (data.affectedRows > 0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post");
    });
  });
};