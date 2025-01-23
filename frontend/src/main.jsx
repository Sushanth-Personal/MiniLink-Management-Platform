import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App';
import { UserProvider } from "./Contexts/UserContext";
import './main.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <UserProvider>
    <App />
  </UserProvider>
  </StrictMode>,
)
