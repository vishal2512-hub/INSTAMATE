import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkModeContextProvider } from "./Context/DarkModeContext";
import { AuthContextProvider } from "./Context/AuthContext";
import App from "./App";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <DarkModeContextProvider>
        <AuthContextProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </AuthContextProvider>
      </DarkModeContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
