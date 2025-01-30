import { useRef, useEffect } from "react";
import styles from "./BottomUpMenu.module.css";

const BottomUpMenu = ({
  options = ["Settings"],
  dispatch,
  isOpen,
  setIsOpen,
  buttonRef,
}) => {
  const menuRef = useRef(null);

  // Set up the event listener to handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is outside the menu and buttonRef, close the menu
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false); // Close the menu
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    // Cleanup the event listener when the component unmounts or isOpen changes
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, setIsOpen, buttonRef]); // Dependencies: run the effect when `isOpen` or `buttonRef` changes

  // Handle button click to dispatch the corresponding action and close the menu
  const handleClick = (option) => {
    let actionType;
    switch (option) {
      case "Dashboard":
        actionType = "SET_DASHBOARD_ACTIVE";
        break;
      case "Analytics":
        actionType = "SET_ANALYTICS_ACTIVE";
        break;
      case "Settings":
        actionType = "SET_SETTINGS_ACTIVE";
        break;
      case "Link":
        actionType = "SET_LINK_ACTIVE";
        break;
      default:
        actionType = ""; // Default case (no action)
    }

    if (actionType) {
      dispatch({ type: actionType });
      setIsOpen(false); // Close the menu after action
    }
  };

  // Prevent click inside the menu from closing it
  const handleClickInside = (event) => {
    event.stopPropagation(); // Prevent event from bubbling up to the document level
  };

  return (
    <div ref={menuRef} onClick={handleClickInside}>
      <div
        className={`${styles.menuContainer} ${
          isOpen ? styles.open : ""
        }`}
      >
        <ul className={styles.menuOptions}>
          {options.map((option, index) => (
            <li
              key={index}
              className={styles.menuOption}
              onClick={() => handleClick(option)} // Handle click event
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BottomUpMenu;
