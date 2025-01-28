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
const useFetch = (url, options = {}, fetchOnMount = true, page = null, limit = null) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: page || 1,
    totalPages: 1,
    totalItems: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Create dynamic query params object
      const params = {};
      if (page !== null) params.page = page;
      if (limit !== null) params.limit = limit;

      const response = await axios.get(url, {
        ...options,
        params, // Dynamically pass params only when needed
      });
      console.log(response.data);
      setData(response.data); // Set response data
      if (response.data.pagination) {
        setPagination({
          currentPage: response.data.pagination.currentPage,
          totalPages: response.data.pagination.totalPages,
          totalItems: response.data.pagination.totalItems,
        });
      }
      setError(null);
    } catch (err) {
      setError(err.message || "Something went wrong!");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchOnMount) {
      fetchData();
    }
  }, [url, page, limit]); // Refetch when these values change

  return { data, error, loading, pagination, refetch: fetchData };
};

export default useFetch;
