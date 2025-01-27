import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../Contexts/UserContext";
// import { api } from "../api/api"; 
import axios from "axios";
const useAuth = () => {
  const { setUserData, setUserId, setIsLoggedIn} = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const userResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user`, { withCredentials: true });
        console.log("userResponse", userResponse);
        if (userResponse.data) {
          setUserId(userResponse.data._id); // Set userId in context
          setUserData({
            ...userResponse.data.user,
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
