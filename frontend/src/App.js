import React, { useContext } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { DarkModeContext } from "./Context/DarkModeContext";
import { AuthContext } from "./Context/AuthContext";

import Login from "./pages/Login/Login";
import Register from "./pages/register/Register";
import Navbar from "./component/navbar/Navbar";
import Leftbar from "./component/Leftbar/Leftbar";
import Rightbar from "./component/rightbar/Rightbar";
import Profile from "./pages/profile/Profile";
import Home from "./pages/home/Home";
import Messages from "./pages/messages/Messages";
import Friends from "./component/Friendlist/Friend";

// Create QueryClient instance
const queryClient = new QueryClient();

const Layout = () => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div
      className={`theme-${darkMode ? "dark" : "light"}`}
      style={{ boxSizing: "border-box" }}
    >
      <Navbar />
      <div style={{ display: "flex" }}>
        <Leftbar />
        <div style={{ flex: 7 }}>
          <Outlet />
        </div>
        <Rightbar />
      </div>
    </div>
  );
};

const MessageLayout = () => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div
      className={`theme-${darkMode ? "dark" : "light"}`}
      style={{ boxSizing: "border-box" }}
    >
      <Navbar />
      <div style={{ display: "flex" }}>
        <Leftbar />
        <div style={{ flex: 11 }}>
          <Messages />
        </div>
      </div>
    </div>
  );
};

const FriendsLayout = () => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div
      className={`theme-${darkMode ? "dark" : "light"}`}
      style={{ boxSizing: "border-box" }}
    >
      <Navbar />
      <div style={{ display: "flex" }}>
        <Leftbar />
        <div style={{ flex: 11 }}>
          <Friends />
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="profile/:id" element={<Profile />} />
      </Route>

      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <MessageLayout />
          </ProtectedRoute>
        }
      >
        <Route path=":conversationId" element={<Messages />} />
      </Route>

      <Route
        path="/friends"
        element={
          <ProtectedRoute>
            <FriendsLayout />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <div style={{ padding: 20 }}>
            <h1>404 - Page Not Found</h1>
          </div>
        }
      />
    </Routes>
  );
};

export default App;
