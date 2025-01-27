const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const Url = require("../models/urlModel");
const crypto = require('crypto');
const base62 = require('base62'); // A Base62 encoding library
const Analytics = require("../models/analyticsModel");
const getUser = async (req, res) => {
  try {
    // Get the userId from cookies
    const userIdFromCookie = req.cookies.userId;
    // console.log("UserIdfromcookie", userIdFromCookie);

    // Check if the userId is a valid ObjectId format
    const userId = mongoose.Types.ObjectId.isValid(userIdFromCookie)
      ? new mongoose.Types.ObjectId(userIdFromCookie)
      : null;

    if (!userId) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    // Fetch user data from the database using the userId, excluding the password field
    const userData = await User.findById(userId).select('-password');

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user data without the password
    return res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while retrieving user data" });
  }
};



const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, newPassword, theme } = req.body;

  // Validate and convert the ID
  const userId = mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(id)
    : null;

  if (!userId) {
    return res.status(400).json({ message: "Invalid userId format" });
  }
  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if password and newPassword are provided
    if (password && newPassword) {
      // Verify the current password
      const isMatch = await user.comparePassword(
        password,
        user.password
      );
      if (!isMatch) {
        return res
          .status(401)
          .json({ error: "Invalid current password" });
      }

      // Hash the new password

      // Update the user's password, username, and email
      user.password = newPassword;
      if (username) user.username = username;
      if (email) user.email = email;
    } else {
      // If no password verification is needed, just update username and email
      if (username) user.username = username;
      if (email) user.email = email;
    }
    if (theme) {
      user.theme = theme;
    }
    // Save the updated user
    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user" });
  }
};


const postUrl = async (req, res) => {
  const { url, expiry, remarks } = req.body;

  // Get userId from the middleware-augmented req object
  const userId = req.user.id;

  if (!url) {
    return res.status(400).json({ message: "URL is required." });
  }

  try {
    // Generate a SHA-256 hash of the URL
    const hash = crypto.createHash('sha256').update(url + Date.now().toString()).digest('hex');

    // Convert the hash to a Base62 string (to shorten the URL)
    const shortUrl = base62.encode(Buffer.from(hash, 'hex').readUIntBE(0, 6)); // Only take part of the hash for a shorter URL

    // Create a new Url document
    const newUrl = new Url({
      userId, // Use userId from the token
      url,
      shortUrl, // Short URL using Base62 encoding
      expiry: expiry ? new Date(expiry) : null,
      remarks: remarks || "",
    });

    // Save to the database
    const savedUrl = await newUrl.save();

    res.status(201).json({
      message: "Shortened URL created successfully.",
      shortUrl: savedUrl.shortUrl,
      data: savedUrl,
    });
  } catch (error) {
    console.error("Error creating shortened URL:", error);
    res.status(500).json({ message: "Server error. Unable to create shortened URL." });
  }
};

const redirectUrl = async (req, res) => {
  const { shortUrl } = req.params;
  
  console.log(shortUrl);
  
  try {
    // Find the URL from the database using the short URL
    const urlRecord = await Url.findOne({ shortUrl });

    if (!urlRecord) {
      return res.status(404).json({ message: "URL not found." });
    }

    // Check if the URL has expired
    if (urlRecord.expiry && new Date(urlRecord.expiry) < new Date()) {
      return res.status(400).json({ message: "The URL has expired." });
    }

    console.log(urlRecord.url);

    // Update analytics for the redirect
    const deviceType = req.headers['user-agent'].toLowerCase();  // Simple device detection using the user-agent header
    const deviceCategory = deviceType.includes('mobile') ? 'mobile' : deviceType.includes('tablet') ? 'tablet' : 'desktop';

    // Find or create analytics record for the URL
    const analyticsRecord = await Analytics.findOne({ urlId: urlRecord._id });

    if (analyticsRecord) {
      // If the record exists, check if there's a click entry for today
      const today = new Date().toISOString().split('T')[0]; // Get today's date (YYYY-MM-DD)

      // Check if there's already a click entry for today
      let todayClick = analyticsRecord.clicks.find(click => click.date.toISOString().split('T')[0] === today);

      if (todayClick) {
        // Increment the device count for today
        todayClick.devices[deviceCategory] = (todayClick.devices[deviceCategory] || 0) + 1;
      } else {
        // Create a new click entry for today
        analyticsRecord.clicks.push({
          date: new Date(),
          devices: { [deviceCategory]: 1 },
        });
      }

      await analyticsRecord.save(); // Ensure the analytics record is saved
    } else {
      // If no analytics record, create a new one
      const newAnalyticsRecord = new Analytics({
        userId: urlRecord.userId,
        urlId: urlRecord._id,
        clicks: [
          {
            date: new Date(),
            devices: { [deviceCategory]: 1 },
          },
        ],
      });

      await newAnalyticsRecord.save(); // Save the new record
    }

    // Increment the clicks field in the UrlRecord
    urlRecord.clicks = (urlRecord.clicks || 0) + 1;  // Ensure it's incremented correctly
    await urlRecord.save();  // Save the updated URL record

    // Redirect to the original URL
    return res.redirect(urlRecord.url);
  } catch (error) {
    console.error("Error redirecting to the URL:", error);
    return res.status(500).json({ message: "Server error. Unable to redirect." });
  }
};


const getUrlsByUser = async (req, res) => {
  try {
    // Extract the userId from the cookies
    const userId = req.cookies.userId;

    // Check if the userId exists in the cookie
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID is missing." });
    }

    // Get the page number and limit from the query parameters (default to page 1 and limit 5)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    console.log("limit",limit);
    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch URLs from the database for the given userId with pagination
    const urls = await Url.find({ userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by latest

    // Get the total number of URLs to calculate the total number of pages
    const totalUrls = await Url.countDocuments({ userId });

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalUrls / limit);
    console.log(urls,page, totalPages, totalUrls);
    // Respond with the paginated URLs and pagination info
    res.status(200).json({
      urls,
      page,
      totalPages,
      totalUrls,
    });
  } catch (error) {
    console.error("Error fetching URLs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  getUser,
  updateUser,
  postUrl,
  redirectUrl,
  getUrlsByUser
};
