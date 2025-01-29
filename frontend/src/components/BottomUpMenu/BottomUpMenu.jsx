
import styles from './BottomUpMenu.module.css';

const BottomUpMenu = ({ options = ['Settings'], dispatch, isOpen, setIsOpen }) => {
  

  // Handle button click to dispatch the corresponding action and close the menu
  const handleClick = (option) => {
    let actionType;
    switch (option) {
      case 'Dashboard':
        actionType = 'SET_DASHBOARD_ACTIVE';
        break;
      case 'Analytics':
        actionType = 'SET_ANALYTICS_ACTIVE';
        break;
      case 'Settings':
        actionType = 'SET_SETTINGS_ACTIVE';
        break;
      case 'Link':
        actionType = 'SET_LINK_ACTIVE';
        break;
      default:
        actionType = ''; // Default case (no action)
    }

    if (actionType) {
      dispatch({ type: actionType });
      setIsOpen(false); // Close the menu after action
    }
  };

  return (
    <div>
      <div className={`${styles.menuContainer} ${isOpen ? styles.open : ''}`}>
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
