import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import LoginPage from "./pages/LoginPage/LoginPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import "./App.css";
import {api} from "./api/api";
function App() {
  let baseURL;

  if (import.meta.env.VITE_API_STATUS === "DEVELOPMENT") {
    baseURL = `http://localhost:${import.meta.env.VITE_API_PORT}`;
  }

  if (import.meta.env.VITE_API_STATUS === "PRODUCTION") {
    baseURL = import.meta.env.VITE_API_BASE_URL;
  }
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a backend health check or wake-up process
    const checkBackend = async () => {
      try {
        const response = await api.get(`${baseURL}/connection`);
        if (response.status===200) {
          console.log("Backend Response:", response.data.message);
          setIsLoading(false);
        }
      } catch (error) {
        console.log("Backend waking up...");
        console.error("Error checking backend health:", error);
        setTimeout(checkBackend, 3000); // Retry every 3 seconds
      }
    };

    checkBackend();
  }, []);

  if (isLoading) {
    // Display loading screen while waiting
    return (
      <div className="loading-screen">
        <h1>Mini Link</h1>
        <p>Waking up the app. Please wait...</p>
        <ClipLoader color="#ffffff" size={50} />
      </div>
    );
  }
  return (
    <Router>
      <Routes>
        <Route path="/login/" element={<LoginPage />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
