import { db } from '../connect.js';
import jwt from "jsonwebtoken";
import moment from 'moment/moment.js';

export const getComments = (req, res) => {
    const q = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c 
    JOIN users AS u ON (u.id = c.userId)
    WHERE c.postId = ? ORDER BY c.createdAt DESC`;

    db.query(q, [req.query.postId], (err, data) => {
        if (err) {
            console.error("Error fetching comments:", err);
            return res.status(500).json({ error: "Failed to fetch comments" });
        }
        return res.status(200).json(data);
    });
};

export const addComment = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ error: "Not logged in!" });

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json({ error: "Token is not valid!" });

        // Validate required fields
        if (!req.body.desc || !req.body.postId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const q = "INSERT INTO comments(`desc`, `createdAt`, `userId`, `postId`) VALUES (?)";
        
        const values = [
            req.body.desc,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
            req.body.postId  // Changed from postid to postId
        ];

        db.query(q, [values], (err, data) => {
            if (err) {
                console.error("Error adding comment:", err);
                return res.status(500).json({ error: "Failed to add comment" });
            }
            return res.status(200).json({
                message: "Comment has been created",
                commentId: data.insertId
            });
        });
    });
};