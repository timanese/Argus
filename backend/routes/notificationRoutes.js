const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Send notifications to emergency contacts
router.post("/send", notificationController.send);

module.exports = router;
