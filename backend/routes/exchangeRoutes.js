const express = require("express");
const router = express.Router();
const exchangeController = require("../controllers/exchangeController");

// Request an exchange
router.post("/", exchangeController.request);

// Accept an exchange request
router.put("/:id/accept", exchangeController.accept);

// Initiate the actual exchange
router.put("/:id/initiate", exchangeController.initiate);

// Mark an exchange as complete
router.put("/:id/complete", exchangeController.complete);

module.exports = router;
