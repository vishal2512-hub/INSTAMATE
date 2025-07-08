import React, { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { makeRequest } from "../../axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import "./Friendlist.scss";

const Friend = () => {
  const { currentUser } = useContext(AuthContext);

  const { data: friends, refetch } = useQuery({
    queryKey: ["friends", currentUser.id],
    queryFn: async () => {
      const res = await makeRequest.get(`/relationships?followerUserId=${currentUser.id}`);
      return res.data;
    },
  });

  const handleUnfollow = async (friendId) => {
    try {
      await makeRequest.delete(`/relationships/unfollow?userId=${friendId}`);
      refetch(); // Refresh friend list after unfollowing
    } catch (error) {
      console.error("Error unfollowing friend:", error);
    }
  };

  return (
    <div className="friendList">
      <h2>Friends</h2>
      {friends && friends.length > 0 ? (
        <ul>
          {friends.map((friend) => (
            <li key={friend.id} className="friendItem">
              <Link to={`/home/profile/${friend.id}`} className="friendLink">
                <img src={`http://localhost:8801/upload/${friend.profilePic}`} alt={friend.name} className="friendImg" />
                <span>{friend.name}</span>
              </Link>
              <button className="unfollowBtn" onClick={() => handleUnfollow(friend.id)}>
                Unfollow
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No friends yet.</p>
      )}
    </div>
  );
};

export default Friend;
