import { useReducer, useState, useEffect } from "react";
import useAuth from "../../customHooks/useAuth";
import styles from "./dashboard.module.css";
import Modal from "../../components/Modal/Modal";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import CreateNewModal from "../../components/CreateNewModal/CreateNewModal";
import ResultTable from "../../components/ResultTable/ResultTable";
import BarChart from "../../components/BarChart/BarChart";
import ProfileData from "../../components/ProfileData/ProfileData";
import AnalyticsTable from "../../components/AnalyticsTable/AnalyticsTable";
import { useUserContext } from "../../Contexts/UserContext";
import useScreenSize from "../../customHooks/useScreenSize";
import BottomUpMenu from "../../components/BottomUpMenu/BottomUpMenu";
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
  const tabletSize = useScreenSize(900);
  const mobileHorizontalSize = useScreenSize(600);
  // Use the reducer
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showModal, setShowModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    setEditLinkClicked,
    closeModal,
    showConfirmationModal,
    setShowConfirmationModal,
    modalType,
    setModalType,
    userData,
  } = useUserContext();
  const handleCreateNew = () => {
    setModalType("createNew"); // Set modal type based on need
    setShowModal(true);
  };

  useEffect(() => {
    console.log("userData", userData);
  }, [userData]);

  useEffect(() => {
    if (closeModal) {
      setShowModal(false);
      setModalType(null);
    }
  }, [closeModal]);



  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
    console.log(isMenuOpen);
  };

  const getShortForm = (username) => {
    const words = username.trim().split(" "); // Split the username into words
    if (words.length === 1) {
      // If only one word, return the first letter
      return words[0][0].toUpperCase();
    } else if (words.length >= 2) {
      // If two or more words, return the first letter of the first two words
      return (words[0][0] + words[1][0]).toUpperCase();
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setShowConfirmationModal(false);
    setModalType(null); // Reset modal type on close
  };

  const handleDeleteAccount = () => {
    console.log("delete account");
    setShowConfirmationModal(true);
    setModalType("deleteAccount");
  };
  const handleEditLinkClick = (rowId) => {
    setModalType("edit");
    setShowModal(true);
    setEditLinkClicked(rowId);
  };

  const handleDeleteLinkClick = () => {
    console.log("delete link");
    setModalType("deleteUrl");
    setShowConfirmationModal(true);
  };

  // Wrap the Modal component with the HOC to inject dynamic content
  const CreateNewModalWindow = CreateNewModal(Modal);
  const ConfirmationModalWindow = ConfirmationModal(Modal);

  return (
    <section className={styles.Dashboard}>
      {!tabletSize && !mobileHorizontalSize && (
        <div className={styles.menuBar}>
          <img
            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737624351/Logo_Wrapper_uuv2gj.png"
            alt="logo"
          />
          <div className={styles.menuTray}>
            <button
              onClick={() =>
                dispatch({ type: "SET_DASHBOARD_ACTIVE" })
              }
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
              onClick={() =>
                dispatch({ type: "SET_ANALYTICS_ACTIVE" })
              }
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
              onClick={() =>
                dispatch({ type: "SET_SETTINGS_ACTIVE" })
              }
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
      )}

      <div className={styles.mainSection}>
        <nav className={styles.navBar}>
          <div className={styles.leftNav}>
            {tabletSize && (
              <img
                className = {styles.logo}
                src="https://res.cloudinary.com/dtu64orvo/image/upload/v1738152167/download_1_dbcvdx.svg"
                alt="logo"
              />
            )}
            {!tabletSize && !mobileHorizontalSize && (
              <>
                <img
                  src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737634206/%EF%B8%8F_mhduvo.png"
                  alt="goodmorning"
                />
                <p>
                  Good morning, {userData.username}
                  <span>
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </p>
              </>
            )}
          </div>

          <div className={styles.midNav}>
           
           {!mobileHorizontalSize && (<button
              onClick={handleCreateNew}
              className={styles.createNew}
            >
              <img
                src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737634367/Frame_1_rq3xx8.png"
                alt="add"
              />
              Create new
            </button>)}
            
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
            <div 
            role="button"
            onClick={toggleMenu}
            className={styles.shortForm}>
              {userData && userData.username
                ? getShortForm(userData.username)
                : "SU"}
            </div>
          </div>
        </nav>
{/*        
        {tabletSize && (
          <div className={styles.menuBar}>
            <div className={styles.menuTray}>
              {tabletSize && (
                <div className={styles.leftNavMobile}>
                  <img
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737634206/%EF%B8%8F_mhduvo.png"
                    alt="goodmorning"
                  />
                  <p>
                    Good morning, {userData.username}
                    <span>
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </p>
                </div>
              )}
              <button
                onClick={() =>
                  dispatch({ type: "SET_DASHBOARD_ACTIVE" })
                }
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
                onClick={() =>
                  dispatch({ type: "SET_ANALYTICS_ACTIVE" })
                }
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
              <div
                className={`${styles.trayButtons} ${
                  styles.settings
                } ${state.settingsActive ? styles.active : ""}`}
                onClick={() =>
                  dispatch({ type: "SET_SETTINGS_ACTIVE" })
                }
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
        )} */}
        <div
          className={`${styles.mainContent} ${
            state.dashboardActive || state.settingsActive
              ? styles.dashboardActive
              : ""
          }`}
        >
          {/* {state.linkActive && (
            <ResultTable
              handleDeleteLinkClick={handleDeleteLinkClick}
              handleEditLinkClick={handleEditLinkClick}
            />
          )} */}
          {state.analyticsActive && (
            <AnalyticsTable
              handleEditLinkClick={handleEditLinkClick}
            />
          )}
          {state.dashboardActive && <BarChart />}
          {state.settingsActive && (
            <ProfileData handleDeleteAccount={handleDeleteAccount} />
          )}
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
      {showConfirmationModal && (
        <ConfirmationModalWindow
          show={showConfirmationModal}
          onClose={handleCloseModal}
          modalType={modalType}
          headerStyle={{
            backgroundColor: "transparent",
            padding: "20px",
          }}
          closeButtonStyle={{
            color: "black",
          }}
          windowStyle={{
            backgroundColor: "white",
            width: "496px",
            height: "222px",
            borderRadius: "4px",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          }}
        />
      )}
          {mobileHorizontalSize && (<button
              onClick={handleCreateNew}
              className={styles.createNewMobile}
            >
              <img
                src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737634367/Frame_1_rq3xx8.png"
                alt="add"
              />
            </button>)}
            <BottomUpMenu options={['Dashboard','Links', 'Analytics', 'Settings']} dispatch={dispatch} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}  />
    </section>
  );
};

export default Dashboard;
