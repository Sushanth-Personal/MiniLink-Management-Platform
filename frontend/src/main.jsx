import { createRoot } from "react-dom/client";
import App from "./App";
import { UserProvider } from "./Contexts/UserContext";
import "./main.css";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <UserProvider>
    <App />
    <ToastContainer />
  </UserProvider>
);
