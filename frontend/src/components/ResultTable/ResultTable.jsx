import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import useFetch from "../../customHooks/useFetch"; // Import the custom hook
import styles from "./ResultTable.module.css";
import { useUserContext } from "../../Contexts/UserContext";
import { deleteUrl } from "../../api/api";
const ResultTable = ({ handleEditLinkClick }) => {
  const {
    setPageUrlData,
    refreshData,
    setShowConfirmationModal,
    confirmDeleteUrl,
    setConfirmDeleteUrl,
    setModalType,
  } = useUserContext();
  let baseURL;

  if (import.meta.env.VITE_API_STATUS === "DEVELOPMENT") {
    baseURL = `http://localhost:${import.meta.env.VITE_API_PORT}`;
  }

  if (import.meta.env.VITE_API_STATUS === "PRODUCTION") {
    baseURL = import.meta.env.VITE_API_BASE_URL;
  }

  const [data, setData] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
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
    `${baseURL}/api/url?page=${currentPage}&limit=${pageSize}`, // Add pagination query params
    { withCredentials: true }, // Pass additional Axios options here
    true // Automatically fetch data on mount
  );

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  useEffect(() => {
    if (fetchedData) {
      setData(fetchedData.urls); // Assuming the data is wrapped in `items`
      setTotalPages(pagination.totalPages); // Assuming totalPages is part of the response
      setPageUrlData(fetchedData.urls);
    }
  }, [fetchedData]);

  useEffect(() => {
    console.log(data);
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

  const handleDelete = (rowId) => {
    setDeleteId(rowId);
    setModalType("deleteUrl");
    setShowConfirmationModal(true);
  };

  useEffect(() => {
    if (confirmDeleteUrl) {
      handleDeleteLink(deleteId);
    }
  }, [confirmDeleteUrl]);

  const handleDeleteLink = async (rowId) => {
    try {
      if (!rowId) return;
      await deleteUrl(rowId);
      setConfirmDeleteUrl(false);
      setShowConfirmationModal(false);
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      {loading && <p>Loading data...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}

      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.headerCell}>
              <div className={styles.dateGroup}>
                <p>Date</p>
                <span className={styles.sortButtons}>
                  <img
                    role="button"
                    onClick={() => handleSort("expiry", "asc")}
                    className={`${styles.sortButton} ${styles.asc}`}
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1738083451/Vector_9_fdkwkf.png"
                    alt="asc"
                  />
                  <img
                    role="button"
                    onClick={() => handleSort("expiry", "desc")}
                    className={`${styles.sortButton} ${styles.desc}`}
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1738083447/Vector_8_taduxn.png"
                    alt="desc"
                  />
                </span>
              </div>
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
          {data.map((row, index) => (
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
                {row.expiry === null ||
                new Date(row.expiry) > new Date() ? (
                  <p className={styles.active}>Active</p>
                ) : (
                  <p className={styles.inactive}>Inactive</p>
                )}
              </td>

              <td className={styles.cell}>
                <img
                  role="button"
                  onClick={() => handleEditLinkClick(index)}
                  className={styles.editIcon}
                  src="https://res.cloudinary.com/dtu64orvo/image/upload/v1738081242/Icons_3_zzabfr.png"
                  alt="edit"
                />

                <img
                  role="button"
                  className={styles.deleteIcon}
                  onClick={() => handleDelete(row._id)}
                  src="https://res.cloudinary.com/dtu64orvo/image/upload/v1738081533/Icons_6_bmvvl6.png"
                  alt="delete"
                />
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
