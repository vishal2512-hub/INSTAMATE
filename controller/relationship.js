import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req, res) => {
  const q = `
    SELECT u.id, u.name, u.profilePic
    FROM relationships r
    JOIN users u ON r.followedUserId = u.id
    WHERE r.followerUserId = ?`;

  db.query(q, [req.query.followerUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};


export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const checkQuery = "SELECT * FROM relationships WHERE followerUserId = ? AND followedUserId = ?";
    db.query(checkQuery, [userInfo.id, req.body.userId], (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length > 0) return res.status(200).json("Already following");

      const insertQuery = "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?, ?)";
      db.query(insertQuery, [userInfo.id, req.body.userId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Followed successfully");
      });
    });
  });
};

export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const { userId } = req.query; // Ensure userId is correctly received
    if (!userId) return res.status(400).json("User ID is required!");

    const q = "DELETE FROM relationships WHERE followerUserId = ? AND followedUserId = ?";
    
    db.query(q, [userInfo.id, userId], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows === 0) return res.status(404).json("Relationship not found");
      return res.status(200).json("Unfollowed successfully");
    });
  });
};
