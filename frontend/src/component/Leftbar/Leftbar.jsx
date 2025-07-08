import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Friends from "../../assets/1.png";
import Market from "../../assets/3.png";
import Messages from "../../assets/10.png";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { DarkModeContext } from "../../Context/DarkModeContext";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { AuthContext } from "../../Context/AuthContext";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import axios from "axios";
import { makeRequest } from "../../axios";
import "./leftbar.scss";

const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toggle, darkMode } = useContext(DarkModeContext);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasNewMessages, setHasNewMessages] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate("/login");
    setShowSettings(false);
  };

  const handleSettingsClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSettings(!showSettings);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchNewMessages = async () => {
      try {
        const res = await makeRequest.get(
          `/conversations/user/${currentUser.id}`
        );

        const conversations = res.data || [];
        const hasUnread = conversations.some((conv) =>
          conv.messages?.some(
            (msg) => msg.senderId !== currentUser.id && !msg.read // assuming `read` is a boolean
          )
        );
        setHasNewMessages(hasUnread);
      } catch (err) {
        console.error("Failed to fetch new messages:", err);
      }
    };
    fetchNewMessages();
    const interval = setInterval(fetchNewMessages, 5000);
    return () => clearInterval(interval);
  }, [currentUser.id]);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <Link to={`/home/profile/${currentUser?.id}`}>
              {currentUser?.profilePic ? (
                <img
                  src={`https://instamate87.onrender.com/upload/${currentUser.profilePic}`}
                  alt="Profile"
                />
              ) : (
                <AccountCircleOutlinedIcon style={{ fontSize: 40 }} />
              )}
            </Link>
            <span>{currentUser?.name}</span>
          </div>

          <div className="item">
            <Link to="/home">
              <img src={Market} alt="" />
            </Link>
            <span>Home</span>
          </div>

          <div className="item">
            <Link to="/friends">
              <img src={Friends} alt="" />
            </Link>
            <span>Friend</span>
          </div>
          <div className="item">
            <Link to="/messages" style={{ position: "relative" }}>
              <img src={Messages} alt="" />
              {hasNewMessages && (
                <>
                  {""}
                  {console.log("Notification" in window)}
                  {console.log(Notification.permission)}
                  {""}
                  {hasNewMessages && (
                    <span
                      style={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        width: 12,
                        height: 12,
                        background: "#ff4d4f",
                        borderRadius: "50%",
                        display: "inline-block",
                        border: "2px solid #fff",
                      }}
                    />
                  )}
                </>
              )}
            </Link>
            <span>Messages</span>
          </div>
          <div className="item">
            {darkMode ? (
              <WbSunnyOutlinedIcon onClick={toggle} titleAccess="Light Mode" />
            ) : (
              <DarkModeOutlinedIcon onClick={toggle} titleAccess="Dark Mode" />
            )}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </div>
        </div>

        <hr />

        <div className="menu" ref={settingsRef}>
          <div className="item settings-item" onClick={handleSettingsClick}>
            <SettingsIcon />
            <span>Settings</span>
          </div>

          {showSettings && (
            <div className="settings-dropdown">
              <div className="item" onClick={handleLogout}>
                <LogoutIcon />
                <span>Logout</span>
              </div>

              <div className="item">
                <Link to={`/home/profile/${currentUser?.id}`} className="link">
                  <AccountCircleIcon />
                  <span>Edit Profile</span>
                </Link>
              </div>

              <div className="item">
                <Link to="/register" className="link">
                  <PersonAddIcon />
                  <span>Add Account</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
