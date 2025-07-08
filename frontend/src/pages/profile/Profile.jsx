import React, { useContext, useState } from "react";
import "./profile.scss";
import {
  Facebook,
  Instagram,
  Twitter,
  Place,
  Language,
  Bookmark,
  GridOn,
  PersonPinCircle,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../Context/AuthContext";
import { makeRequest } from "../../axios";
import Update from "../../component/update/Update";
import Posts from "../../component/Posts/Posts";
import { useEffect } from "react";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const { id } = useParams();
  const userId = parseInt(id, 10);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    isLoading,
    error,
    data: user,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await makeRequest.get(`/users/find/${userId}`);
      return response.data;
    },
  });

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (user) {
      setIsFollowing(user.isFollowing || false);
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: async (following) => {
      if (following) {
        await makeRequest.delete(`/relationships?userId=${userId}`);
      } else {
        await makeRequest.post("/relationships", { userId });
      }
    },
    onMutate: () => {
      setIsFollowing((prev) => !prev);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", userId]);
    },
    onError: () => {
      setIsFollowing((prev) => !prev);
    },
  });

  const handleMessageClick = async () => {
    if (!user || !user.id || !user.name) {
      console.error("User data is incomplete:", user);
      return;
    }
    try {
      const res = await makeRequest.post(`/conversations/findOrCreate`, {
        userId1: currentUser.id,
        userId2: userId,
      });
      const conversationId = res.data.conversationId;
      if (!conversationId) {
        throw new Error("No conversationId returned from API");
      }
      navigate(`/messages/${conversationId}`, {
        state: { userName: user.name, userId },
      });
    } catch (err) {
      console.error("Error starting conversation:", err);
    }
  };

  if (isLoading) return <div className="profile">Loading...</div>;
  if (error) return <div className="profile">Error loading profile: {error.message}</div>;
  if (!user) return <div className="profile">No user data found</div>;

  return (
    <div className="profile">
      <div className="images">
        <img className="cover" src={`http://localhost:8801/upload/${user.coverPic}`} alt="Cover" />
        <img
          className="profilePic"
          src={`http://localhost:8801/upload/${user.profilePic}`}
          alt="Profile"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <Facebook />
            <Instagram />
            <Twitter />
          </div>
          <div className="center">
            <span>{user.name}</span>
            {user.city && (
              <div className="info">
                <Place />
                <span>{user.city}</span>
              </div>
            )}
            {user.website && (
              <div className="info">
                <Language />
                <span>{user.website}</span>
              </div>
            )}
          </div>
          <div className="right">
            {userId === currentUser.id ? (
              <button onClick={() => setOpenUpdate(true)}>Edit Profile</button>
            ) : (
              <>
                <button
                  className={isFollowing ? "following" : ""}
                  onClick={() => mutation.mutate(isFollowing)}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
                <button onClick={handleMessageClick}>Message</button>
              </>
            )}
          </div>
        </div>

        <div className="contentTabs">
          <div
            className={`tab ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => setActiveTab("posts")}
          >
            <GridOn /> POSTS
          </div>
          <div
            className={`tab ${activeTab === "saved" ? "active" : ""}`}
            onClick={() => setActiveTab("saved")}
          >
            <Bookmark /> SAVED
          </div>
          <div
            className={`tab ${activeTab === "tagged" ? "active" : ""}`}
            onClick={() => setActiveTab("tagged")}
          >
            <PersonPinCircle /> TAGGED
          </div>
        </div>

        <div className="contentSection">
          {activeTab === "posts" && <Posts userId={userId} />}
          {activeTab === "saved" && (
            <div className="savedContent">Saved posts will appear here</div>
          )}
          {activeTab === "tagged" && (
            <div className="taggedContent">Tagged posts will appear here</div>
          )}
        </div>
      </div>

      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={user} />}
    </div>
  );
};

export default Profile;