const express = require("express");
const router = express.Router();
const {
  getUser,
  updateUser, 

} = require("../controllers/mainController.js");

router.get("/user", getUser);
router.put("/user", updateUser);
router.get("/", (req, res) => res.status(200).json({ message: "Connected" }));

module.exports = router;
