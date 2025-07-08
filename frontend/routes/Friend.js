const express = require("express");
const router = express.Router();
const db = require("../db"); // ✅ Import your database connection

// ✅ GET Friends List for a User
router.get("/", async (req, res) => {
  const userId = req.query.userId; // ✅ Get userId from query parameters

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const query = `
      SELECT users.id, users.username, users.profilePic
      FROM friends
      JOIN users ON friends.friendId = users.id
      WHERE friends.userId = ?;
    `;
    const [friends] = await db.query(query, [userId]);

    res.status(200).json(friends);
  } catch (err) {
    console.error("Error fetching friends:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
