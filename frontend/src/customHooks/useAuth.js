import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../Contexts/UserContext";
import Cookies from 'js-cookie';
import axios from "axios";
const useAuth = () => {
  const { setUserData, setUserId, setIsLoggedIn} = useUserContext();
  const navigate = useNavigate();

  let baseURL;
  
if (import.meta.env.VITE_API_STATUS === "DEVELOPMENT") {
  baseURL = `http://localhost:${import.meta.env.VITE_API_PORT}`;
}

if (import.meta.env.VITE_API_STATUS === "PRODUCTION") {
  baseURL = import.meta.env.VITE_API_BASE_URL;
}

  useEffect(() => {
    console.log(Cookies.get('accessToken'))
    const authenticateUser = async () => {
      try {
        const userResponse = await axios.get(`${baseURL}/api/user`, { withCredentials: true });
        if (userResponse.data) {
          setUserId(userResponse.data._id); // Set userId in context
          setUserData({
            ...userResponse.data,
            userId: userResponse.data._id,
          }); // Set full userData in context
          setIsLoggedIn(true);
        } else {
          console.error("User data not found");
          navigate("/login"); // Redirect to login
        }
      } catch (error) {
        console.error("Error during authentication:", error);
        navigate("/login"); // Redirect to login on error
      }
    };
  
    authenticateUser();
  }, [navigate, setUserData, setUserId, setIsLoggedIn]); // All dependencies are correctly listed
  
};

export default useAuth;
