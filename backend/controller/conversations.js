import { db } from "../connect.js";

export const findOrCreateConversation = async (req, res) => {
  const { userId1, userId2 } = req.body;  // <-- Read from req.body now

  const parsedUserId1 = parseInt(userId1, 10);
  const parsedUserId2 = parseInt(userId2, 10);

  if (isNaN(parsedUserId1) || isNaN(parsedUserId2)) {
    console.error("Invalid user IDs:", { userId1, userId2 });
    return res.status(400).json({ message: "Invalid user IDs" });
  }

  try {
    const [users] = await db.promise().query(
      `SELECT id FROM users WHERE id IN (?, ?)`,
      [parsedUserId1, parsedUserId2]
    );

    if (users.length !== 2) {
      return res.status(400).json({ message: `Users not found: ${parsedUserId1}, ${parsedUserId2}` });
    }

    const [existing] = await db.promise().query(
      `SELECT c.id 
       FROM conversations c
       JOIN conversation_members cm1 ON c.id = cm1.conversation_id
       JOIN conversation_members cm2 ON c.id = cm2.conversation_id
       WHERE cm1.user_id = ? AND cm2.user_id = ? LIMIT 1`,
      [parsedUserId1, parsedUserId2]
    );

    if (existing.length > 0) {
      return res.status(200).json({ conversationId: existing[0].id });
    }

    const [insertResult] = await db.promise().query(
      "INSERT INTO conversations (created_at) VALUES (NOW())"
    );

    const conversationId = insertResult.insertId;

    await db.promise().query(
      `INSERT INTO conversation_members (conversation_id, user_id)
       VALUES (?, ?), (?, ?)`,
      [conversationId, parsedUserId1, conversationId, parsedUserId2]
    );

    res.status(200).json({ conversationId });
  } catch (err) {
    console.error("Error in findOrCreateConversation:", err);
    res.status(500).json({
      message: "Error finding/creating conversation",
      error: process.env.NODE_ENV === "development" ? err.stack : err.message,
    });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const parsedConversationId = parseInt(conversationId, 10);
    if (isNaN(parsedConversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    const [rows] = await db.promise().query(
      `SELECT cm.user_id, u.username 
       FROM conversation_members cm
       JOIN users u ON cm.user_id = u.id
       WHERE cm.conversation_id = ?`,
      [parsedConversationId]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error in getConversation:", err);
    res.status(500).json({
      message: "Error fetching conversation",
      error: process.env.NODE_ENV === "development" ? err.stack : err.message,
    });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const [queryResult] = await db.query(
      `SELECT c.id AS conversation_id, cm.user_id, u.username
       FROM conversations c
       JOIN conversation_members cm ON c.id = cm.conversation_id
       JOIN users u ON cm.user_id = u.id
       WHERE c.id IN (
         SELECT conversation_id 
         FROM conversation_members 
         WHERE user_id = ?
       )
       ORDER BY c.created_at DESC`,
      [userId]
    );

    if (!queryResult || queryResult.length === 0) {
      return res.status(404).json({ message: "No conversations found" });
    }

    // Group members by conversation_id
    const groupedConversations = queryResult.reduce((acc, row) => {
      const conversation = acc.find(c => c.conversation_id === row.conversation_id);

      if (conversation) {
        conversation.members.push({
          user_id: row.user_id,
          username: row.username,
        });
      } else {
        acc.push({
          conversation_id: row.conversation_id,
          members: [{
            user_id: row.user_id,
            username: row.username,
          }],
        });
      }

      return acc;
    }, []);

    res.status(200).json(groupedConversations);
  } catch (err) {
    console.error("Error in getUserConversations:", err);
    res.status(500).json({
      message: "Error fetching conversations",
      error: process.env.NODE_ENV === "development" ? err.stack : err.message,
    });
  }
};
