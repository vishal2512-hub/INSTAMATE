import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { makeRequest } from '../../axios';
import { parseISO } from 'date-fns';
import moment from 'moment';
import './messages.scss';

const Messages = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const scrollRef = useRef();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiver, setReceiver] = useState({ id: null, name: '', image: '' });
  const [conversations, setConversations] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [lastSeen, setLastSeen] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [conversationNotFound, setConversationNotFound] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await makeRequest.get(`/conversations/user/${currentUser.id}`);
        setConversations(res.data || []);
      } catch {
        setConversations([]);
      }
    };
    fetchConversations();
  }, [currentUser.id]);

  // Fetch messages and poll for updates
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) return;
      try {
        const res = await makeRequest.get(`/messages/${conversationId}`);
        const formattedMessages = res.data.map((msg) => ({
          ...msg,
          senderId: msg.sender_id || msg.senderId, // Handle both field names
          createdAt: msg.createdAt ? parseISO(msg.createdAt) : new Date(),
        }));
        setMessages(formattedMessages);
        setConversationNotFound(false);
      } catch (err) {
        setConversationNotFound(err.response?.status === 404);
        setMessages([]);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [conversationId]);

  // Set receiver info
  useEffect(() => {
    if (!conversationId || !conversations.length) return;
    
    const conv = conversations.find((c) => String(c.conversation_id) === String(conversationId));
    if (!conv) return;
    
    const otherUser = conv.members?.find((m) => m.user_id !== currentUser.id);
    if (otherUser) {
      setReceiver({
        id: otherUser.user_id,
        name: otherUser.username || otherUser.name || 'Unknown User',
        image: otherUser.profilePic || 'https://via.placeholder.com/40',
      });
      setLastSeen(otherUser.lastSeen ? parseISO(otherUser.lastSeen) : null);
      setIsOnline(otherUser.isOnline || false);
    }
  }, [conversationId, conversations, currentUser.id]);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;
    try {
      let fileUrl = null;
      let fileType = null;
      
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadRes = await makeRequest.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        fileUrl = uploadRes.data.url || uploadRes.data.filename;
        fileType = selectedFile.type.startsWith('video') ? 'video' : 'image';
      }

      const currentTime = new Date();
      const res = await makeRequest.post('/messages', {
        conversationId,
        senderId: currentUser.id,
        text: newMessage,
        fileUrl,
        fileType,
        createdAt: currentTime,
      });

      setMessages((prev) => [
        ...prev,
        {
          ...res.data,
          senderId: currentUser.id, // Explicitly set senderId to current user
          senderName: currentUser.name || currentUser.username || 'You',
          createdAt: currentTime,
        },
      ]);
      setNewMessage('');
      setSelectedFile(null);
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  // Handle deleting messages
  const handleDeleteMessage = async (messageId) => {
    try {
      await makeRequest.delete(`/messages/${messageId}`);
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (err) {
      console.error('Delete message error:', err);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="messages-page">
      <div className="chat-sidebar">
        <div className="sidebar-header">Chats</div>
        {conversations.length === 0 ? (
          <div className="no-chats">No conversations yet</div>
        ) : (
          conversations.map((conv) => {
            const otherUser = conv.members?.find((m) => m.user_id !== currentUser.id);
            if (!otherUser) return null;
            
            return (
              <div
                key={conv.conversation_id}
                className={`chat-user ${String(conv.conversation_id) === String(conversationId) ? 'active' : ''}`}
                onClick={() => navigate(`/messages/${conv.conversation_id}`)}
              >
                <div className="chat-info">
                  <div className="chat-user-info">
                    <div>
                      <div className="chat-username">{otherUser.username || otherUser.name}</div>
                      <div className="chat-last-message">{conv.lastMessage?.text?.slice(0, 25)}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="receiver-info">
              <div className="receiver-name">{receiver.name}</div>
              {!conversationNotFound &&
                (isOnline ? (
                  <span className="status-online">Online</span>
                ) : (
                  lastSeen && moment(lastSeen).isValid() && (
                    <span className="status-last-seen">
                      Last seen {moment(lastSeen).fromNow()}
                    </span>
                  )
                ))}
            </div>
          </div>
        </div>

        <div className="chat-messages">
          {conversationNotFound ? (
            <div className="conversation-not-found">
              <h2>Conversation Not Found</h2>
              <p>This conversation does not exist or was deleted.</p>
              <button onClick={() => navigate('/messages')} className="back-to-chats-btn">
                Return to Chats
              </button>
            </div>
          ) : (
            <div className="messages-container">
              {messages.map((m) => {
                const isSender = m.senderId === currentUser.id;
                const senderName = isSender 
                  ? 'You' 
                  : receiver.name;

                return (
                  <div
                    key={m.id}
                    className={`message ${isSender ? 'sender' : 'receiver'}`}
                    onMouseEnter={() => setHoveredMessageId(m.id)}
                    onMouseLeave={() => setHoveredMessageId(null)}
                  >
                    <div className="message-header">
                    <div className="message-info">
  <span className="message-time">
    {m.createdAt ? moment(m.createdAt).format('h:mm A') : ''}
  </span>
</div>
                    </div>
                    {m.text && <div className="message-text">{m.text}</div>}
                    {m.fileUrl && m.fileType === 'video' && (
                      <video controls className="message-media">
                        <source src={'upload/'+m.fileUrl} type="video/mp4" />
                      </video>
                    )}
                    {isSender && hoveredMessageId === m.id && (
                      <button
                        className="delete-message-btn"
                        onClick={() => handleDeleteMessage(m.id)}
                      >
                        Delete
                      </button>
                    )}
                    <div ref={scrollRef} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {!conversationNotFound && (
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <label className="file-upload-label">
              📎
              <input
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </label>
            <button onClick={handleSendMessage} disabled={!newMessage.trim() && !selectedFile}>
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;