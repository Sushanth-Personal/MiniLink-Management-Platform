const express = require("express");
const router = express.Router();
const {
  getUser,
  updateUser, 
  postUrl,

} = require("../controllers/mainController.js");

router.get("/user", getUser);
router.put("/user", updateUser);
router.post("/url", postUrl);

router.get("/", (req, res) => res.status(200).json({ message: "Connected" }));

module.exports = router;
