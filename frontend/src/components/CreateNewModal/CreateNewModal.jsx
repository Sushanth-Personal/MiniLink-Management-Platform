import styles from "./createnewmodal.module.css";
import Switch from "../Switch/Switch";
import DatePicker from "../DatePicker/CustomDatePicker";
import { useState, useEffect } from "react";
import { postUrl, updateUrl } from "../../api/api";
import { useUserContext } from "../../Contexts/UserContext";
import { format, parseISO } from "date-fns";

const CreateNewModal = (WrappedComponent) => {
  return function ModalContent({ modalType, ...props }) {
    const [expiry, setExpiry] = useState(
      "Select Expiry Date and Time"
    );
    const [remarks, setRemarks] = useState("");
    const [url, setUrl] = useState("");

    const {
      pageUrlData,
      editLinkClicked,
      setCloseModal,
      setRefreshData,
      setExpirySwitch,
      expirySwitch,
    } = useUserContext();
    const [data, setData] = useState(pageUrlData[editLinkClicked]);

    useEffect(() => {
      if (data && data.expiry && modalType === "edit") {
        // Format the existing expiry date
        const formattedExpiry = format(
          parseISO(data.expiry),
          "MMM dd, yyyy, hh:mm a"
        );
        setExpiry(formattedExpiry);
        console.log("Formatted preloaded expiry:", formattedExpiry);
      }
      if (data && modalType === "edit") {
        setUrl(data.url);
        setRemarks(data.remarks);
      }
     
    }, [data]);

    useEffect(() => {
      if(!expirySwitch){
        setExpiry("Select Expiry Date and Time");
      }
    },[expirySwitch])

    const handleSave = async () => {
      try {
        console.log(url, remarks, expiry);
      
        const response = await updateUrl(url, remarks, expiry);
        console.log(response.data);
        setData(response.data);
        setCloseModal(true);
        setRefreshData(true);
        setRemarks("");
        setExpiry("Select Expiry Date and Time");
        setUrl("");
      } catch (error) {
        console.log(error);
      }
    };
    const handleSwitchChange = (state) => {
      setExpirySwitch(state); // Directly set the new state
    };

    const handleDateSelection = (date) => {
      // Format the selected date
      const formattedDate = format(date, "MMM dd, yyyy, hh:mm a");
      setExpiry(formattedDate); // Update expiry with formatted date
      console.log("Selected date (formatted):", formattedDate);
    };

    useEffect(() => {
      console.log("expirySwitch:", expirySwitch);
    }, [expirySwitch]);

    const handleCreateNew = async () => {
      if (!url.trim()) {
        alert("Destination URL is required!");
        return;
      }

      if (!remarks.trim()) {
        alert("Remarks are required!");
        return;
      }

      try {
        const response = await postUrl(url, remarks, expiry);
        console.log(response.data);
        alert("Link created successfully!");
        // Optionally clear form fields after success
        setUrl("");
        setRemarks("");
        setExpiry("Select Expiry Date and Time");
        setExpirySwitch(true);
        setCloseModal(true);
        setRefreshData(true);
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
                <DatePicker
                  handleDateSelection={handleDateSelection}
                />
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
            <button
              onClick={handleCreateNew}
              className={styles.createButton}
            >
              Create new
            </button>
          </div>
        </>
      );
    } else if (modalType === "edit") {
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
                <DatePicker
                  handleDateSelection={handleDateSelection}
                />
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
            <button
              onClick={handleSave}
              className={styles.createButton}
            >
              Save
            </button>
          </div>
        </>
      );
    }

    return <WrappedComponent {...props}>{content}</WrappedComponent>;
  };
};

export default CreateNewModal;
