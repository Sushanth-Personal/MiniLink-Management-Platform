import React, { useReducer, useState } from "react";
import useAuth from "../../customHooks/useAuth";
import styles from "./dashboard.module.css";
import Modal from "../../components/Modal/Modal";
import CreateNewModal from "../../components/CreateNewModal/CreateNewModal";

// Initial state for the reducer
const initialState = {
  dashboardActive: true, // Default active button
  linkActive: false,
  analyticsActive: false,
  settingsActive: false,
};

// Reducer function to handle state updates
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DASHBOARD_ACTIVE":
      return {
        dashboardActive: true,
        linkActive: false,
        analyticsActive: false,
        settingsActive: false,
      };
    case "SET_LINK_ACTIVE":
      return {
        dashboardActive: false,
        linkActive: true,
        analyticsActive: false,
        settingsActive: false,
      };
    case "SET_ANALYTICS_ACTIVE":
      return {
        dashboardActive: false,
        linkActive: false,
        analyticsActive: true,
        settingsActive: false,
      };
    case "SET_SETTINGS_ACTIVE":
      return {
        dashboardActive: false,
        linkActive: false,
        analyticsActive: false,
        settingsActive: true,
      };
    default:
      return state;
  }
};

const Dashboard = () => {
  useAuth();

  // Use the reducer
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const handleCreateNew = () => {
    setModalType("createNew"); // Set modal type based on need
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType(null); // Reset modal type on close
  };

  // Wrap the Modal component with the HOC to inject dynamic content
  const CreateNewModalWindow = CreateNewModal(Modal);


  return (
    <section className={styles.Dashboard}>
      <div className={styles.menuBar}>
        <img
          src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737624351/Logo_Wrapper_uuv2gj.png"
          alt="logo"
        />
        <div className={styles.menuTray}>
          <button
            onClick={() => dispatch({ type: "SET_DASHBOARD_ACTIVE" })}
            className={`${styles.trayButtons} ${
              state.dashboardActive ? styles.active : ""
            }`}
          >
            <img
              src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737624518/Icons_zqiriu.png"
              alt="dashboard"
            />
            Dashboard
          </button>
          <button
            onClick={() => dispatch({ type: "SET_LINK_ACTIVE" })}
            className={`${styles.trayButtons} ${
              state.linkActive ? styles.active : ""
            }`}
          >
            <img
              src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737624522/Icon_rahplm.png"
              alt="link"
            />
            Link
          </button>
          <button
            onClick={() => dispatch({ type: "SET_ANALYTICS_ACTIVE" })}
            className={`${styles.trayButtons} ${
              state.analyticsActive ? styles.active : ""
            }`}
          >
            <img
              src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737624528/Icon_1_g710hl.png"
              alt="analytics"
            />
            Analytics
          </button>
        </div>
        <div className={styles.settingsTray}>
          <div
            className={`${styles.trayButtons} ${styles.settings} ${
              state.settingsActive ? styles.active : ""
            }`}
            onClick={() => dispatch({ type: "SET_SETTINGS_ACTIVE" })}
          >
            <img
              className={styles.settingsIcon}
              src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737624533/Frame_vnitbr.png"
              alt="settings"
            />
            Settings
          </div>
        </div>
      </div>
      <div className={styles.mainSection}>
        <nav className={styles.navBar}>
          <div className={styles.leftNav}>
            <img
              src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737634206/%EF%B8%8F_mhduvo.png"
              alt="goodmorning"
            />
            <p>
              Good morning, Sujith
              <span>Tue, Jan 25</span>
            </p>
          </div>

          <div className={styles.midNav}>
            <button
              onClick={handleCreateNew}
              className={styles.createNew}
            >
              <img
                src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737634367/Frame_1_rq3xx8.png"
                alt="add"
              />
              Create new
            </button>
            <div className={styles.searchContainer}>
              <img src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737634977/Frame_2_cs2ror.png" />
              <input
                type="text"
                name="remarks"
                placeholder="Search by remarks"
              />
            </div>
          </div>
          <div className={styles.rightNav}>
            <div className={styles.shortForm}>SU</div>
          </div>
        </nav>
        <div className={styles.mainContent}>
          <div className={styles.paddingContainer}></div>
        </div>
      </div>
      {showModal && (
  <CreateNewModalWindow
    show={showModal}
    onClose={handleCloseModal}
    title={modalType === "createNew" ? "New Link" : "Edit Link"}
    modalType={modalType}
  />
)}
    </section>
  );
};

export default Dashboard;
