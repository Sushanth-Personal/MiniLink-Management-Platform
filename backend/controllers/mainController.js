const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const Url = require("../models/urlModel");
const crypto = require('crypto');
const base62 = require('base62'); // A Base62 encoding library

const getUser = async (req, res) => {
  try {
    // Get the userId from cookies
    const userIdFromCookie = req.cookies.userId;

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
    // Redirect to the original URL
    return res.redirect(urlRecord.url);
  } catch (error) {
    console.error("Error redirecting to the URL:", error);
    return res.status(500).json({ message: "Server error. Unable to redirect." });
  }
}
module.exports = {
  getUser,
  updateUser,
  postUrl,
  redirectUrl
};
