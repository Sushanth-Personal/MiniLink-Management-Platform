import { useState, useEffect } from "react";
import styles from "./ProfileData.module.css";
import useFetch from "../../customHooks/useFetch";
import { updateUser, deleteUser } from "../../api/api";
import { useUserContext } from "../../Contexts/UserContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileData = ({ handleDeleteAccount }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const { deleteAccount, setDeleteAccount } = useUserContext();

  let baseURL;

  if (import.meta.env.VITE_API_STATUS === "DEVELOPMENT") {
    baseURL = `http://localhost:${import.meta.env.VITE_API_PORT}`;
  }

  if (import.meta.env.VITE_API_STATUS === "PRODUCTION") {
    baseURL = import.meta.env.VITE_API_BASE_URL;
  }

  const {
    data: fetchedData,
    error,
    loading,
    refetch,
  } = useFetch(
    `${baseURL}/api/user`,
    { withCredentials: true }, // Pass additional Axios options here
    true // Automatically fetch data on mount
  );

  useEffect(() => {
    if (fetchedData) {
      setFormData({
        username: fetchedData.username,
        email: fetchedData.email,
        contact: fetchedData.contact,
      });
      setOriginalData({
        username: fetchedData.username,
        email: fetchedData.email,
        contact: fetchedData.contact,
      });
    }
  }, [fetchedData]);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    console.log("Saved Data:", formData);

    try {
      const response = await updateUser(formData);
     console.log(response);
      if (response.message && response.status!==200) {
        console.log("error");
        toast.error(response.message, {
          position: "top-right",
          autoClose: 3000, // Closes toast after 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

      if(response.status === 200){
        console.log("success")
        toast.success(response.message, {
          position: "top-right",
          autoClose: 3000, // Closes toast after 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    handleDeleteAccount();
  };

  useEffect(() => {
    const deleteUserAccount = async () => {
      if (deleteAccount) {
        try {
          const response = await deleteUser();
          console.log(response);
          setDeleteAccount(false);
          window.location.reload();
        } catch (error) {
          console.log(error);
        }
      }
    };

    deleteUserAccount();
  }, [deleteAccount]);

 return (
  <div className={styles.profileData}>
    {loading && <p>Loading data...</p>}
    {error && <p className={styles.error}>Error: {error}</p>}

    <form className={styles.profileForm}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>Name</label>
        <input
          type="text"
          id="name"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter your name"
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>Email ID</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter your email ID"
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="mobile" className={styles.label}>Mobile Number</label>
        <input
          type="tel"
          id="mobile"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter your mobile number"
        />
      </div>
      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.saveButton}
          onClick={handleSave}
          disabled={!hasChanges} // Disable button if no changes
        >
          Save Changes
        </button>
        <button
          type="button"
          className={styles.deleteButton}
          onClick={handleDelete}
        >
          Delete Account
        </button>
      </div>
    </form>
  </div>
);
};

export default ProfileData;
