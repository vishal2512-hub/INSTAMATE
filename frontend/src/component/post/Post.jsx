import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comment";
import { useState, useContext, useEffect, useCallback } from "react";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../Context/AuthContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  if (!currentUser) return null;

  const { data: likesData, isLoading } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: async () => {
      const res = await makeRequest.get("/likes", { params: { postId: post.id } });
      return res.data;
    },
    enabled: !!post.id,
  });

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (likesData) {
      setIsLiked(likesData.likedUsers?.includes(currentUser.id) || false);
      setLikeCount(likesData.likeCount ?? 0);
    }
  }, [likesData, currentUser.id]);

  const sendNotification = useCallback(async (type, receiverId, postId) => {
    if (receiverId === currentUser.id) return;
    try {
      await makeRequest.post("/notifications", {
        type,
        senderId: currentUser.id,
        receiverId,
        postId,
      });
    } catch (error) {
      console.error("Notification Error:", error.response?.data || error.message);
    }
  }, [currentUser.id]);

  const likeMutation = useMutation({
    mutationFn: async () => {
      return isLiked
        ? await makeRequest.delete("/likes", { data: { postId: post.id } })
        : await makeRequest.post("/likes", { postId: post.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["likes", post.id]);
      if (!isLiked) sendNotification("like", post.userId, post.id);
    },
  });

  const handleLike = useCallback(() => {
    likeMutation.mutate();
  }, [likeMutation, isLiked]);

  const deleteMutation = useMutation({
    mutationFn: () => makeRequest.delete("/posts/" + post.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleShareClick = () => {
    setShareOpen(!shareOpen);
    sendNotification("share", post.userId, post.id);
  };

  const postUrl = `https://yourdomain.com/post/${post.id}`;

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={`http://localhost:8801/upload/${post.profilePic}`} alt="User" />
            <div className="details">
              <Link to={`/home/profile/${post.userId}`} style={{ textDecoration: "none", color: "inherit" }}>
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <button onClick={handleDelete}>Delete</button>
          )}
        </div>

        <div className="content">
          <p>{post.desc}</p>
          {post.img && <img src={`http://localhost:8801/upload/${post.img}`} alt="Post" />}
          {post.video && <video controls src={`http://localhost:8801/upload/${post.video}`} className="post-video" />}
        </div>

        <div className="info">
          <div className="item" onClick={handleLike}>
            {isLoading ? "Loading..." : isLiked
              ? <FavoriteOutlinedIcon style={{ color: "red", cursor: "pointer" }} />
              : <FavoriteBorderOutlinedIcon style={{ cursor: "pointer" }} />}
            {likeCount} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {post.commentsCount} Comments
          </div>
          <div className="item share-container">
            <div onClick={handleShareClick} style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
              <ShareOutlinedIcon />
              Share
            </div>
            {shareOpen && (
              <div className="share-options">
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`} target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
                <a href={`https://wa.me/?text=${encodeURIComponent(postUrl)}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </div>
            )}
          </div>
        </div>

        {commentOpen && <Comments postId={post.id} postUserId={post.userId} />}
      </div>
    </div>
  );
};

export default Post;
