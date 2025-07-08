import React, { useContext, useState } from "react";
import "./comment.scss";
import { AuthContext } from "../../Context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comment = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error: fetchError, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      try {
        const response = await makeRequest(`/comments?postId=${postId}`);
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch comments");
      }
    },
    refetchInterval: 60000,
  });

// In Comment.jsx, modify your addComment mutation:
const mutation = useMutation({
  mutationFn: (newComment) => {
    return makeRequest.post("/comments", newComment)
      .then(() => {
        // Create notification when someone comments
        if (post.userId !== currentUser.id) {  // Don't notify for self-comments
          makeRequest.post("/notifications", {
            type: "comment",
            postId: post.id,
            receiverId: post.userId
          });
        }
      });
  },
  onSuccess: () => {
    queryClient.invalidateQueries(["comments"]);
    setDesc("");
  },
});

  const handleClick = (e) => {
    e.preventDefault();
    if (!desc.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    
    mutation.mutate({ desc, postId });
  };

  // Function to get the correct image URL
  const getImageUrl = (profilePic) => {
    if (!profilePic) return "/default-avatar.png";
    return profilePic.startsWith("http") ? profilePic : `/upload/${profilePic}`;
  };

  return (
    <div className="comments">
      {/* Comment Counter */}
      <div className="comment-counter">
        {data?.length || 0} Comment{data?.length !== 1 ? 's' : ''}
      </div>
      
      <div className="write">
        <img 
          src={getImageUrl(currentUser?.profilePic)} 
          alt="Profile" 
          onError={(e) => {
            e.target.src = "/default-avatar.png";
          }}
        />
        <input
          type="text"
          value={desc}
          placeholder="write a comment"
          onChange={(e) => setDesc(e.target.value)}
          disabled={mutation.isLoading}
        />
        <button 
          onClick={handleClick}
          disabled={mutation.isLoading || !desc.trim()}
        >
          {mutation.isLoading ? "Sending..." : "Send"}
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}

      {fetchError ? (
        <div className="error-message">Failed to load comments</div>
      ) : isLoading ? (
        <div>Loading comments...</div>
      ) : (
        data?.map((comment) => (
          <div className="comment" key={comment.id}>
            <img 
              src={getImageUrl(comment.profilePic)} 
              alt={`${comment.name}'s profile`}
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.desc}</p>
            </div>
            <span className="date">
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default Comment;