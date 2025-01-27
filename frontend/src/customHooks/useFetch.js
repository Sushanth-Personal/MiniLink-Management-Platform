import { useState, useEffect } from "react";
import axios from "axios";

/**
 * Custom hook for fetching data with optional pagination using Axios.
 * 
 * @param {string} url - The endpoint to fetch data from.
 * @param {Object} options - Additional Axios configuration (e.g., headers, withCredentials).
 * @param {boolean} fetchOnMount - If true, fetch data on mount.
 * @param {number} page - The current page for pagination.
 * @param {number} limit - The number of items per page.
 * @returns {Object} An object containing the data, error, loading state, pagination info, and a refetch function.
 */
const useFetch = (url, options = {}, fetchOnMount = true, page = 1, limit = 5) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: page,
    totalPages: 1,
    totalItems: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url, {
        ...options,
        params: { page, limit }, // Send page and limit as query params
      });
    
      setData(response.data.urls); // Assuming the data structure has `urls` in the response
      setPagination({
        currentPage: response.data.page,
        totalPages: response.data.totalPages,
        totalItems: response.data.totalUrls,
      });
      setError(null);
    } catch (err) {
      setError(err.message || "Something went wrong!");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Refetch when URL, page, or limit changes
  useEffect(() => {
    if (fetchOnMount) {
      fetchData();
    }
  }, [url, page, limit]); // Refetch only if these values change

  // Prevent refetch if the data is already available and valid
  useEffect(() => {
    if (page === 1 && !data) {
      fetchData(); // Ensure data is fetched if it's the first page and data is not already fetched
    }
  }, [page, limit, data]); // Triggered only when page, limit, or data changes

  return { data, error, loading, pagination, refetch: fetchData };
};

export default useFetch;
