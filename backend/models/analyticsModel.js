const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "User",
      required: true,
    },
    urlId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the URL being tracked
      ref: "Url",
      required: true,
    },
    clicks: [
      {
        date: {
          type: Date, // The specific date for tracking
          required: true,
        },
        devices: {
          desktop: {
            type: Number,
            required: false,
            default: 0,
          },
          mobile: {
            type: Number,
            required: false,
            default: 0,
          },
          tablet: {
            type: Number,
            required: false,
            default: 0,
          },
        },
      },
    ],
  },
  { timestamps: true }
);

// Export the Analytics model
const Analytics = mongoose.model("Analytics", analyticsSchema);
module.exports = Analytics;
