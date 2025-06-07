import { createContext, useEffect, useState } from "react";
import { makeRequest } from "../axios.js";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  

  const login = async (username, password) => {
    try {
      console.log("Login called");
      console.log(username, password);
      
      const response = await makeRequest.post('/auth/login', { username, password });

      // Update local storage and state
      localStorage.setItem("user", JSON.stringify(response.data));
      setCurrentUser(response.data);

      console.log("Login successful:", response.data);
    } catch (error) {
      console.error("Error during login:", error.response?.data || error.message);
    }
  };


  // Keep state and localStorage in sync
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    }
  }, [currentUser]);
  
  console.log(currentUser)

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};
