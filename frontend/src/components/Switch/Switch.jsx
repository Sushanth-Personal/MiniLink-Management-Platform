import { useState } from "react";
import styles from "./switch.module.css"; // Import the CSS module

const Switch = ({ initialChecked = false, onChange }) => {
  const [checked, setChecked] = useState(initialChecked);

  const handleToggle = () => {
    const newState = !checked;
    setChecked(newState);
    if (onChange) {
      onChange(newState); // Notify parent component if `onChange` is passed
    }
  };

  return (
    <div className={styles.switch}>
      <button
        id="custom-switch"
        className={`${styles.mdcSwitch} ${checked ? styles.mdcSwitchSelected : ""}`}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleToggle}
      >
        <div className={styles.mdcSwitchTrack}></div>
        <div className={styles.mdcSwitchHandleTrack}>
          <div className={styles.mdcSwitchHandle}>
            <div className={styles.mdcSwitchShadow}>
              <div className={styles.mdcElevationOverlay}></div>
            </div>
            <div className={styles.mdcSwitchRipple}></div>
            <div className={styles.mdcSwitchIcons}>
              <svg
                className={`${styles.mdcSwitchIcon} ${checked ? "" : styles.mdcSwitchIconHidden}`}
                viewBox="0 0 24 24"
              >
                <path d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z" />
              </svg>
              <svg
                className={`${styles.mdcSwitchIcon} ${!checked ? "" : styles.mdcSwitchIconHidden}`}
                viewBox="0 0 24 24"
              >
                <path d="M20 13H4v-2h16v2z" />
              </svg>
            </div>
          </div>
        </div>
        <span className={styles.mdcSwitchFocusRingWrapper}>
          <div className={styles.mdcSwitchFocusRing}></div>
        </span>
      </button>
    </div>
  );
};

export default Switch;
