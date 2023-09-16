const express = require("express");
const router = express.Router();
const meetingController = require("../controllers/meetingController");
const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return next(); // Token is not provided

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(); // Token is invalid
    req.user = user; // Attach user to the request object
    next();
  });
};

router.post("/:meetingId/uploadGPS", meetingController.uploadGPS);

router.post("/:meetingId/uploadAudioBlob", meetingController.uploadAudioBlob);

// Request an exchange
router.post("/request", meetingController.request);

router.get("/share/:uniqueId", authenticateJWT, meetingController.share);

// Accept an exchange request
router.put("/:id/accept", meetingController.accept);

// Initiate the actual exchange
router.put("/:id/initiate", meetingController.initiate);

// Mark an exchange as complete
router.put("/:id/complete", meetingController.complete);

module.exports = router;
