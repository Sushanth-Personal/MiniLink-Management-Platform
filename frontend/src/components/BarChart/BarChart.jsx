import React, { useEffect, useState } from "react";
import styles from "./BarChart.module.css"; // Import CSS for styling
import useFetch from "../../customHooks/useFetch";

const BarChart = () => {
  let baseURL;

  if (import.meta.env.VITE_API_STATUS === "DEVELOPMENT") {
    baseURL = `http://localhost:${import.meta.env.VITE_API_PORT}`;
  }

  if (import.meta.env.VITE_API_STATUS === "PRODUCTION") {
    baseURL = import.meta.env.VITE_API_BASE_URL;
  }

  // Fetch data
  const {
    data: fetchedData,
    error,
    loading,
  } = useFetch(
    `${baseURL}/api/clicks`, // Fetch data from /api/clicks
    { withCredentials: true },
    true // Automatically fetch data on mount
  );

  const [clickData, setClickData] = useState({
    totalClicks: 0,
    clicksPerDevice: [],
    clicksPerDay: [],
  });

  const expectedDevices = ["mobile", "desktop", "tablet"]; // List of expected device types

  useEffect(() => {
    if (fetchedData) {
      // Ensure all expected devices are in the data, even if the count is 0
      const updatedClicksPerDevice = expectedDevices.map((device) => {
        const deviceData = fetchedData.clicksPerDevice.find(
          (item) => item.deviceType === device
        );
        return {
          deviceType: device,
          clicks: deviceData ? deviceData.clicks : 0, // Set 0 if the device is not in the data
        };
      });
  
      // Process clicksPerDay to make it cumulative and reverse the order
      const cumulativeClicksPerDay = fetchedData.clicksPerDay.reduce(
        (acc, currentDay, index) => {
          const previousTotal = index === 0 ? 0 : acc[index - 1].totalClicks; // Initialize total for the first day
          acc.push({
            day: currentDay.day,
            totalClicks: previousTotal + currentDay.totalClicks, // Add current day's clicks to the running total
          });
  
          return acc;
        },
        [] // Start with an empty array
      );
  
      // Reverse the order and take the latest 4 dates
      const latest4ClicksPerDay = cumulativeClicksPerDay
        .reverse() // Reverse the order of the dates
        .slice(0, 4); // Keep only the latest 4
  
      setClickData({
        totalClicks: fetchedData.totalClicks,
        clicksPerDevice: updatedClicksPerDevice,
        clicksPerDay: latest4ClicksPerDay, // Use the reversed and sliced data
      });
    }
  }, [fetchedData]);
  
    // Calculate max values for normalization
    const maxClicksPerDay = Math.max(...clickData.clicksPerDay.map(day => day.totalClicks), 1);
    const maxClicksPerDevice = Math.max(...clickData.clicksPerDevice.map(device => device.clicks), 1);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div className={styles.chartContainer}>
      {/* Total Clicks */}
      <div className={styles.totalClicks}>
        Total Clicks: <p>{clickData.totalClicks}</p>
      </div>
      <div className={styles.displaySection}>
      <div className={styles.clicksPerDay}>
          {/* Clicks Per Day */}

          <h3>Date-wise Clicks</h3>
          <div className = {styles.displayContent}>
            <div className={styles.labelColumn}>
              {clickData.clicksPerDay.map((day, index) => (
                <>
                  <div key={index} className={styles.barWrapper}>
                    <span className={styles.label}>{day.day}</span>
                  </div>
                </>
              ))}
            </div>
            <div className={styles.barColumn}>
              {clickData.clicksPerDay.map((day, index) => (
                <>
                {console.log("MaxCLicks per day", day.totalClicks,maxClicksPerDay)}
                  <div key={index} className={styles.barWrapper}>
                    <div
                      className={styles.bar}
                      style={{ width: `${(day.totalClicks / maxClicksPerDay) * 100}px` }} // Adjust width dynamically
                    ></div>
                  </div>
                </>
              ))}
            </div>
            <div className={styles.clicksColumn}>
              {clickData.clicksPerDay.map((day, index) => (
                <span key={index} className={styles.clickCountRight}>
                  {day.totalClicks}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.clicksPerDevice}>
          {/* Clicks Per Device */}

          <h3>Clicks Per Device</h3>
          <div className = {styles.displayContent}>
            <div className={styles.labelColumn}>
              {clickData.clicksPerDevice.map((device, index) => (
                <>
                  <div key={index} className={styles.barWrapper}>
                    <span className={styles.label}>
                    {device.deviceType.charAt(0).toUpperCase() + device.deviceType.slice(1)}
                    </span>
                  </div>
                </>
              ))}
            </div>
            <div className={styles.barColumn}>
              {clickData.clicksPerDevice.map((device, index) => (
                <>
                {console.log("MaxCLicks per device", device.clicks ,maxClicksPerDay)}
                  <div key={index} className={styles.barWrapper}>
                    <div
                      className={styles.bar}
                      style={{ width: `${(device.clicks / maxClicksPerDevice) * 100}px` }}
                      
                    ></div>
                  </div>
                </>
              ))}
            </div>
            <div className={styles.clicksColumn}>
              {clickData.clicksPerDevice.map((device, index) => (
                <span key={index} className={styles.clickCountRight}>
                  {device.clicks}
                </span>
              ))}
            </div>
                    </div>
          </div>
    
      </div>
    </div>
  );
};

export default BarChart;
