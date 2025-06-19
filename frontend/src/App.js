import React, { useContext } from "react";
import Login from "./pages/Login/Login";
import Register from "./pages/register/Register";
import Navbar from "./component/navbar/Navbar";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Leftbar from "./component/Leftbar/Leftbar";
import Rightbar from "./component/rightbar/Rightbar";
import Profile from "./pages/profile/Profile";
import Home from "./pages/home/Home";
import { DarkModeContext } from "./Context/DarkModeContext";
import { AuthContext } from "./Context/AuthContext";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Messages from "./pages/messages/Messages";
import Friends from "./component/Friendlist/Friend"

// Create QueryClient instance
const queryClient = new QueryClient();

const Layout = () => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div className={`theme-${darkMode ? "dark" : "light"}`} style={{ boxSizing: "border-box" }}>
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
    <div className={`theme-${darkMode ? "dark" : "light"}`} style={{ boxSizing: "border-box" }}>
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

// ✅ Friends Layout Component (Duplicate of MessageLayout)
const FriendsLayout = () => {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={`theme-${darkMode ? "dark" : "light"}`} style={{ boxSizing: "border-box" }}>
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

// ✅ Protected Route for Authentication
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return children;
};




const router = createBrowserRouter([
  {
    path: "/INSTAMATE",
    element: <Navigate to="/login" />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "profile/:id", element: <Profile /> },
    ],
  },
  {
    path: "/messages",
    element: (
      <ProtectedRoute>
        <MessageLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: ":conversationId", element: <Messages /> },
    ],
  },
  {
    path: "/friends",
    element: (
      <ProtectedRoute>
        <FriendsLayout />
      </ProtectedRoute>
    ),
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "*", // ✅ Catch-all route
    element: <div style={{ padding: 20 }}><h1>404 - Page Not Found</h1></div>,
  }
]);


const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
