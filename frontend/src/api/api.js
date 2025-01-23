import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Ensure you're using the correct import here
import Cookies from 'js-cookie';
let baseURL;

if (import.meta.env.VITE_API_STATUS === "DEVELOPMENT") {
  baseURL = "http://localhost:5000";
}

if (import.meta.env.VITE_API_STATUS === "PRODUCTION") {
  baseURL = import.meta.env.VITE_API_BASE_URL;
}

export const api = axios.create({
  baseURL: `${baseURL}`,
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null;
  }
  
api.interceptors.request.use((config) => {
    if (config.url.includes("/api")) {
      try {
        const accessToken = getCookie('accessToken'); // Read token from cookie
  
        if (!accessToken) {
          window.location.href = "/login";
          return Promise.reject("No access token found");
        }
  
        // Decode token to check expiration
        const decodedAccessToken = jwtDecode(accessToken);
        const accessTokenExpiryTime = decodedAccessToken.exp * 1000 - Date.now();
  
        if (accessTokenExpiryTime <= 0) {
          // Token expired
          console.warn("Access token expired. Redirecting to login...");
          window.location.href = "/login";
          return Promise.reject("Access token expired");
        }
  
        // No need to manually add token to headers; it will be handled by the browser automatically
        return config;
      } catch (error) {
        console.error("Failed to decode token:", error);
        window.location.href = "/login";
        return Promise.reject(error);
      }
    } else {
      return config;
    }
  });
  

// Interceptor for handling unauthorized responses
api.interceptors.response.use(
    (response) => {
      // Simply return the response if no errors occurred
      return response;
    },
    (error) => {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        // Log a warning message
        console.warn(
          "Unauthorized or forbidden response. Redirecting to login..."
        );
  
        // Redirect to login page
        window.location.href = "/login";
      }
      // Reject the promise with the error object
      return Promise.reject(error);
    }
  );
  

export const checkAuthentication = async () => {
  try {
    const response = await api.get("/protected/");
    console.log("checkAuthentication", response);
    return response.data;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

export const loginUser = async (email, password) => {
  console.log(email, password);
  // Check if identifier and password are provided
  if (!email || !password) {
    console.error("Identifier and password are required");
    return { message: "Identifier and password are required" };
  }

  try {
    const response = await axios.post(`${baseURL}/auth/login`, {
      email,
      password,
    }, {
      withCredentials: true,  // Ensure cookies are included in the request
    });
    
    console.log(response.data);
    const { user } = response.data;

    // Log cookies (if not HttpOnly)
    console.log("Cookies after login:", Cookies.get('userId'));

    // Store userId in localStorage
    localStorage.setItem("userId", user._id);

    return { message: "Success", user };
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error.message);

    return error.response?.data.message || "Login failed";
  }
};

  
export const registerUser = async (username, email,contact,password) => {
  try {
    console.log(username, email,contact, password);
    const response = await axios.post(`${baseURL}/auth/register`, {
      username,
      email,
      contact,
      password,
    });
    return response.data.message; //
    //  Return the data directly
  } catch (error) {
    console.error("Error registering:", error.response.data.message);

    return error.response.data.message; // Handle error by returning null or an empty array
  }
};



