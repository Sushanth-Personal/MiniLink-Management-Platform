import styles from "./createnewmodal.module.css";
import Switch from "../Switch/Switch";
import DatePicker from "../DatePicker/CustomDatePicker";
import { useState } from "react";
import {postUrl} from "../../api/api";

const CreateNewModal = (WrappedComponent) => {
  return function ModalContent({ modalType, ...props }) {
    const [expiry, setExpiry] = useState("Select Expiry Date and Time");
    const [remarks, setRemarks] = useState("");
    const [url, setUrl] = useState("");
    const [expirySwitch, setExpirySwitch] = useState(true);

    const handleSwitchChange = (state) => {
      setExpirySwitch(state); // Directly set the new state
    };

    const handleDateSelection = (date) => {
      setExpiry(date); // Update expiry date
    };

    const handleCreateNew = async () => {
      if (!url.trim()) {
        alert("Destination URL is required!");
        return;
      }

      if (!remarks.trim()) {
        alert("Remarks are required!");
        return;
      }

      const requestData = {
        url,
        remarks,
        expiry: expirySwitch ? expiry : null,
      };

      try {
       
        const response = await postUrl(url, remarks, expiry);
        console.log(response.data);
        alert("Link created successfully!");
        // Optionally clear form fields after success
        setUrl("");
        setRemarks("");
        setExpiry("Select Expiry Date and Time");
        setExpirySwitch(true);
      } catch (error) {
        console.error("Error creating link:", error);
        alert("Failed to create link. Please try again.");
      }
    };

    let content = null;

    if (modalType === "createNew") {
      content = (
        <>
          <div className={styles.top}>
            <div className={styles.destinationUrlContainer}>
              <span>
                Destination Url <p>*</p>
              </span>
              <input
                type="url"
                placeholder="Enter URL to be shortened"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <div
              className={`${styles.destinationUrlContainer} ${styles.remarksContainer}`}
            >
              <span>
                Remarks <p>*</p>
              </span>
              <textarea
                placeholder="Add remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
              />
            </div>
            <div className={styles.linkExpiry}>
              <span>Link Expiration</span>
              <Switch
                initialChecked={expirySwitch}
                onChange={handleSwitchChange}
              />
            </div>
            <div className={styles.datePicker}>
              <div className={styles.displayField}>{expiry}</div>
              <div className={styles.datePickerContainer}>
                <DatePicker handleDateSelection={handleDateSelection} />
              </div>
            </div>
          </div>
          <div className={styles.actionBar}>
            <button
              className={styles.clearButton}
              onClick={() => {
                setUrl("");
                setRemarks("");
                setExpiry("Select Expiry Date and Time");
                setExpirySwitch(true);
              }}
            >
              Clear
            </button>
            <button onClick={handleCreateNew} className={styles.createButton}>
              Create new
            </button>
          </div>
        </>
      );
    } else if (modalType === "edit") {
      content = (
        <div>
          <p>This is an edit modal!</p>
          <button onClick={props.onClose}>Close</button>
        </div>
      );
    }

    return <WrappedComponent {...props}>{content}</WrappedComponent>;
  };
};

export default CreateNewModal;
