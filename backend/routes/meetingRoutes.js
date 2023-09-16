const express = require("express");
const router = express.Router();
const meetingController = require("../controllers/meetingController");
const jwt = require("jsonwebtoken");

router.post("/:meetingId/uploadGPS", meetingController.uploadGPS);

router.post("/:meetingId/uploadAudioBlob", meetingController.uploadAudioBlob);

// Request an exchange
router.post("/request", meetingController.request);

// Accept an exchange request
router.put("/:id/accept", meetingController.accept);

// Initiate the actual exchange
router.put("/:id/initiate", meetingController.initiate);

// Mark an exchange as complete
router.put("/:id/complete", meetingController.complete);

module.exports = router;
