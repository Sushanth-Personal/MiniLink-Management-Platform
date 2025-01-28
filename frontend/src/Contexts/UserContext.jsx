import { createContext, useState, useContext, useMemo } from "react";
import PropTypes from "prop-types";

// Create the context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {

  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [editLinkClicked, setEditLinkClicked] = useState(0);
  const [pageUrlData, setPageUrlData] = useState({});
  const [closeModal, setCloseModal] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmDeleteUrl, setConfirmDeleteUrl] = useState(false); 
  const [modalType, setModalType] = useState(null);
  const [expirySwitch, setExpirySwitch] = useState(true);
  const [clearModal, setClearModal] = useState(false);
  const value = useMemo(
    () => ({
      userId,
      setUserId,
      isLoggedIn,
      setIsLoggedIn,
      userData,
      setUserData,
      editLinkClicked,
      setEditLinkClicked,
      pageUrlData,
      setPageUrlData,
      closeModal,
      setCloseModal,
      refreshData,
      setRefreshData,
      deleteAccount,
      setDeleteAccount,
      showConfirmationModal,
      setShowConfirmationModal,
      confirmDeleteUrl,
      setConfirmDeleteUrl,
      modalType,
      setModalType,
      expirySwitch,
      setExpirySwitch,
      clearModal,
      setClearModal
    }),
    [
      userId,
      setUserId,
      isLoggedIn,
      setIsLoggedIn,
      userData,
      setUserData,
      editLinkClicked,
      setEditLinkClicked,
      pageUrlData,
      setPageUrlData,
      closeModal,
      setCloseModal,
      refreshData,
      setRefreshData,
      deleteAccount,
      setDeleteAccount,
      showConfirmationModal,
      setShowConfirmationModal,
      confirmDeleteUrl,
      setConfirmDeleteUrl,
      modalType,
      setModalType,
      expirySwitch,
      setExpirySwitch,
      clearModal,
      setClearModal
    ]
  );

  return (
    <UserContext.Provider value={value}>
      {children} {/* Render the children inside the provider */}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(
      "useUserContext must be used within a UserProvider"
    );
  }
  return context;
};

// PropTypes validation
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Set a display name for debugging
UserContext.displayName = "UserContext";

export default UserContext;
