import React, { useContext, useState, useEffect } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined"; // Import fallback icon
import { Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import "./navbar.scss";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const queryClient = useQueryClient();

  // Fetch notifications
  const { isLoading, error, data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await makeRequest.get("/notifications");
      return res.data;
    },
    refetchInterval: 30000, // Auto refresh notifications every 30 seconds
  });

  // Unread notification count
  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  // Mutation to mark notifications as read
  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      await makeRequest.put("/notifications/read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  useEffect(() => {
    if (showNotifications && unreadCount > 0) {
      markAsReadMutation.mutate();
      queryClient.invalidateQueries(["notifications"]); // Ensure UI updates
    }
  }, [showNotifications, unreadCount, queryClient]);

  // Get notification text
  const getNotificationText = (notification) => {
    switch (notification.type) {
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "post":
        return "created a new post";
      default:
        return "interacted with your post";
    }
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/home" style={{ textDecoration: "none" }}>
          <span>Instamate</span>
        </Link>
        <HomeOutlinedIcon />
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        {/* Notification Bell */}
        <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
          {unreadCount > 0 ? (
            <NotificationsActiveIcon style={{ color: "#5271ff" }} />
          ) : (
            <NotificationsOutlinedIcon />
          )}
          {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
        </div>

        {/* Notification Dropdown */}
        {showNotifications && (
          <div className="notifications-dropdown">
            {isLoading ? (
              <div className="loading">Loading notifications...</div>
            ) : error ? (
              <div className="error">Error loading notifications</div>
            ) : notifications.length === 0 ? (
              <div className="no-notifications">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className={`notification-item ${!notification.isRead ? "unread" : ""}`}>
                  {notification.profilePic ? (
                    <img src={`http://localhost:8801/upload/${notification.profilePic}`} alt="User" />
                  ) : (
                    <AccountCircleOutlinedIcon className="fallback-icon" />
                  )}
                  <div className="notification-content">
                    <span className="notification-user">{notification.name}</span>
                    <span className="notification-text">{getNotificationText(notification)}</span>
                    <span className="notification-time">{moment(notification.createdAt).fromNow()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* User Profile */}
        <div className="user">
          <Link to={`/home/profile/${currentUser?.id}`}>
            {currentUser?.profilePic ? (
                    <img src={`http://localhost:8801/upload/${currentUser.profilePic}`} alt="User" />
            ) : (
              <AccountCircleOutlinedIcon style={{ fontSize: 40 }} />
            )}
          </Link>
          <span>{currentUser?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
