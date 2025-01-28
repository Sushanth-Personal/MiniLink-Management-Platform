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
        console.log(deviceData);
        return {
          deviceType: device,
          clicks: deviceData ? deviceData.clicks : 0, // Set 0 if the device is not in the data
        };
      });

      // Process clicksPerDay to make it cumulative
      const cumulativeClicksPerDay = fetchedData.clicksPerDay.reduce(
        (acc, currentDay) => {
          // If there are no previous totals, start with 0
          const previousTotal =
            acc.length > 0 ? acc[acc.length - 1].totalClicks : 0;

          // Add current day's clicks to the running total
          acc.push({
            day: currentDay.day,
            totalClicks: previousTotal + currentDay.totalClicks, // Cumulative total
          });

          return acc;
        },
        [] // Start with an empty array
      );

      setClickData({
        totalClicks: fetchedData.totalClicks,
        clicksPerDevice: updatedClicksPerDevice,
        clicksPerDay: cumulativeClicksPerDay, // Use cumulative data
      });
    }
  }, [fetchedData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div className={styles.chartContainer}>
      {/* Total Clicks */}
      <div className={styles.totalClicks}>
        Total Clicks: {clickData.totalClicks}
      </div>

      {/* Clicks Per Device */}
      <h3>Clicks Per Device</h3>
      {clickData.clicksPerDevice.map((device, index) => (
        <div key={index} className={styles.barWrapper}>
          <span className={styles.label}>{device.deviceType}</span>
          <div
            className={styles.bar}
            style={{ width: `${device.clicks * 10}px` }} // Adjust width based on clicks
          ></div>
          <span className={styles.clickCountRight}>
            {device.clicks}
          </span>
        </div>
      ))}

      {/* Clicks Per Day */}
      <h3>Clicks Per Day</h3>
      {clickData.clicksPerDay.map((day, index) => (
        <div key={index} className={styles.barWrapper}>
          <span className={styles.label}>{day.day}</span>
          <div
            className={styles.bar}
            style={{ width: `${day.totalClicks * 10}px` }} // Adjust width dynamically
          >
            <span className={styles.clickCountRight}>
              {day.totalClicks}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BarChart;
