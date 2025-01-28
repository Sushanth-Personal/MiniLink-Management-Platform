import axios from "axios";
import Cookies from 'js-cookie';
let baseURL;

if (import.meta.env.VITE_API_STATUS === "DEVELOPMENT") {
  baseURL = `http://localhost:${import.meta.env.VITE_API_PORT}`;
}

if (import.meta.env.VITE_API_STATUS === "PRODUCTION") {
  baseURL = import.meta.env.VITE_API_BASE_URL;
}

export const api = axios.create({
  baseURL: `${baseURL}`,
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


export const postUrl = async (url, remarks, expiry) => {
  try {
    console.log(url, remarks, expiry);
    const response = await api.post("/api/url", { url, remarks, expiry }, {
      withCredentials: true,
    });
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error posting URL:", error.response.data.message);
    return error.response.data.message; // Handle error by returning null or an empty array
  }
}


export const updateUrl = async (url, remarks, expiry) => {
  try {
    console.log(url, remarks, expiry);
    const response = await api.put("/api/url", { url, remarks, expiry }, {
      withCredentials: true,
    });
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error posting URL:", error.response.data.message);
    return error.response.data.message; // Handle error by returning null or an empty array
  }
}

export const deleteUrl = async (rowId) => {
  try {
    console.log(rowId);
    const response = await api.delete(`/api/url/${rowId}`, {
      withCredentials: true,
    });
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error deleting URL:", error.response.data.message);
    return error.response.data.message; // Handle error by returning null or an empty array
  }
}

export const updateUser = async (updatedData) => {
  try {
    const response = await api.put(`/api/user/`, updatedData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error.response.data.message);
    return error.response.data.message;
  }
};

export const deleteUser = async () => {
  try {
    const response = await api.delete(`/api/user/`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error.response.data.message);
    return error.response.data.message;
  }
};
