import React, { useState } from "react";
import DatePicker from "react-datepicker"; // Import the DatePicker component
import "react-datepicker/dist/react-datepicker.css"; // Import default styles
import { format } from "date-fns"; // Import date-fns for formatting
import styles from "./customdatepicker.module.css";
import "./customdatepicker.css";
import {useUserContext} from "../../Contexts/UserContext";
const CustomDatePicker = ({  handleDateSelection }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const {expirySwitch} = useUserContext();
  const handleChange = (date) => {
    setSelectedDate(date);

    // Format the date as "Jan 15, 2025, 11:56 PM"
    const formattedDate = format(date, "MMM dd, yyyy, hh:mm a");
    console.log("Selected date (formatted):", formattedDate);

    // Call the function passed as a prop with the formatted date
    if (handleDateSelection) {
      handleDateSelection(formattedDate);
    }
  };

  return (
    <div className={styles.datePickerContainer}>
      <img
        className={styles.icon}
        src="https://res.cloudinary.com/dtu64orvo/image/upload/v1737710322/Icons_1_jorrgy.png"
        alt="icon"
      />
 
      {expirySwitch && (
        <DatePicker
          selected={selectedDate}
          onChange={handleChange}
          showTimeSelect
          timeFormat="hh:mm a"
          timeIntervals={15}
          dateFormat="MMM dd, yyyy, hh:mm a"
          disabledKeyboardNavigation
        />
      )}
      {!expirySwitch && (
        <DatePicker disabled disabledKeyboardNavigation />
      )}
    </div>
  );
};

export default CustomDatePicker;
