import { db } from "../connect.js";

// ✅ Fetch stories from the last 24 hours
export const getStories = (req, res) => {
  const q = `
    SELECT s.id, s.userId, s.img, u.name, u.profilePic, s.createdAt 
    FROM stories s 
    JOIN users u ON u.id = s.userId
    WHERE s.createdAt > DATE_SUB(NOW(), INTERVAL 24 HOUR)
    ORDER BY s.createdAt DESC
  `;

  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(200).json(data);
  });
};

// ✅ Add a new story
export const addStory = (req, res) => {
  const { userId } = req.body;
  const img = req.file ? `/uploads/${req.file.filename}` : null;

  if (!userId || !img) {
    return res.status(400).json({ error: "User ID and Image are required" });
  }

  const q = "INSERT INTO stories (`userId`, `img`) VALUES (?, ?)";
  const values = [userId, img];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(201).json({ message: "Story has been added successfully.", img });
  });
};

// ✅ Delete a story
export const deleteStory = (req, res) => {
  const storyId = req.params.id;

  const q = "DELETE FROM stories WHERE id = ?";
  db.query(q, [storyId], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(200).json({ message: "Story deleted successfully." });
  });
};