import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import useFetch from "../../customHooks/useFetch"; // Import the custom hook
import styles from "./ResultTable.module.css";
import { useUserContext } from "../../Contexts/UserContext";
const ResultTable = ({handleEditLinkClick}) => {
  const { setPageUrlData } = useUserContext();
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
  const pageSize = 2; // Set the number of items per page

  const {
    data: fetchedData,
    pagination,
    error,
    loading,
    refetch,
  } = useFetch(
    `${baseURL}/api/results?page=${currentPage}&limit=${pageSize}`, // Add pagination query params
    { withCredentials: true }, // Pass additional Axios options here
    true // Automatically fetch data on mount
  );

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  useEffect(() => {
    if (fetchedData) {
      setData(fetchedData); // Assuming the data is wrapped in `items`
      setTotalPages(pagination.totalPages); // Assuming totalPages is part of the response
      setPageUrlData(fetchedData);
    }
  }, [fetchedData]);

  useEffect(() => {
    console.log(data);
  }, [data]);

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
      <button onClick={refetch} className={styles.refetchButton}>
        Refresh Data
      </button>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.headerCell}>
              Expiry Date
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
            <th className={styles.headerCell}>Remarks</th>
            <th className={styles.headerCell}>Clicks</th>
            <th className={styles.headerCell}>Status</th>
            <th className={styles.headerCell}>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row,index) => (
            <tr key={row._id} className={styles.row}>
              <td className={styles.cell}>
                {new Date(row.expiry).toLocaleDateString()}
              </td>
              <td className={`${styles.cell} ${styles.urlCell}`}>
                {row.url}
              </td>
              <td className={`${styles.cell} ${styles.shortUrlCell}`}>
                <div className={styles.shortUrl}>
                  {baseURL + "/" + row.shortUrl}
                </div>
                <img
                  role="button"
                  onClick={() =>
                    handleCopyToClipboard(
                      baseURL + "/" + row.shortUrl
                    )
                  }
                  className={styles.copyIcon}
                  src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737968945/Icons_2_iv0mah.png"
                  alt="copy"
                />
              </td>
              <td className={styles.cell}>{row.remarks || "N/A"}</td>
              <td className={styles.cell}>{row.clicks}</td>
              <td className={styles.cell}>
                {new Date(row.expiry) > new Date()
                  ? "Active"
                  : "Inactive"}
              </td>
              <td className={styles.cell}>
                <button
                  onClick={() => handleEditLinkClick(index)}
                  className={styles.button}
                >
                  Edit
                </button>
                <button className={styles.button}>Delete</button>
              </td>
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

export default ResultTable;
