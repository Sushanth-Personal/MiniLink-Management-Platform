import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import useFetch from "../../customHooks/useFetch"; // Import the custom hook
import styles from "./AnalyticsTable.module.css";
import { useUserContext } from "../../Contexts/UserContext";
const AnalyticsTable = ({ handleEditLinkClick }) => {
  const { setPageUrlData, refreshData } = useUserContext();
  let baseURL;

  if (import.meta.env.VITE_API_STATUS === "DEVELOPMENT") {
    baseURL = `http://localhost:${import.meta.env.VITE_API_PORT}`;
  }

  if (import.meta.env.VITE_API_STATUS === "PRODUCTION") {
    baseURL = import.meta.env.VITE_API_BASE_URL;
  }

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1); // Track the total number of pages
  const pageSize = 10; // Set the number of items per page

  const {
    data: fetchedData,
    pagination,
    error,
    loading,
    refetch,
  } = useFetch(
    `${baseURL}/api/analytics?page=${currentPage}&limit=${pageSize}`, // Add pagination query params
    { withCredentials: true }, // Pass additional Axios options here
    true // Automatically fetch data on mount
  );

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  useEffect(() => {
    console.log("fetchedData", fetchedData, pagination);
    if (fetchedData && pagination) {
      setData(fetchedData.data);
      setTotalPages(pagination.totalPages);
      setPageUrlData(fetchedData.data);
    }
  }, [fetchedData, pagination]);

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  useEffect(() => {
    if (refreshData) {
      refetch();
    }
  }, [refreshData]);

  const handleSort = (key, direction) => {
    const sortedData = [...data].sort((a, b) => {
      if (key === "expiry") {
        return direction === "asc"
          ? new Date(a.expiry) - new Date(b.expiry)
          : new Date(b.expiry) - new Date(a.expiry);
      } else {
        return direction === "asc"
          ? a[key]?.localeCompare(b[key])
          : b[key]?.localeCompare(a[key]);
      }
    });

    setData(sortedData);
    setSortConfig({ key, direction });
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update the current page when a page button is clicked
  };

  return (
    <div className={styles.container}>
      {loading && <p>Loading data...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}

      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.headerCell}>
              Timestamp
              <span className={styles.sortButtons}>
                <button
                  onClick={() => handleSort("expiry", "asc")}
                  className={styles.sortButton}
                >
                  <ChevronUp />
                </button>
                <button
                  onClick={() => handleSort("expiry", "desc")}
                  className={styles.sortButton}
                >
                  <ChevronDown />
                </button>
              </span>
            </th>
            <th className={styles.headerCell}>Original Link</th>
            <th className={styles.headerCell}>Short Link</th>
            <th className={styles.headerCell}>ip address</th>
            <th className={styles.headerCell}>User Device</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row._id} className={styles.row}>
              <td className={styles.cell}>
                {new Date(row.date).toLocaleString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </td>
              <td className={`${styles.cell} ${styles.urlCell}`}>
                {row.url}
              </td>
              <td className={`${styles.cell} ${styles.shortUrlCell}`}>
                <div className={styles.shortUrl}>
                  {baseURL + "/" + row.shortUrl}
                </div>
              </td>

              <td className={styles.cell}>{row.ipAddress}</td>
              <td className={styles.cell}>{row.deviceType}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Buttons */}
      <div className={styles.pagination}>
        {/* Left Arrow Button */}
        <button
          className={styles.paginationButton}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &#8592; {/* Left Arrow */}
        </button>

        {/* Numeric Page Buttons */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`${styles.paginationButton} ${
              currentPage === index + 1 ? styles.active : ""
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        {/* Right Arrow Button */}
        <button
          className={styles.paginationButton}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &#8594; {/* Right Arrow */}
        </button>
      </div>
    </div>
  );
};

export default AnalyticsTable;
