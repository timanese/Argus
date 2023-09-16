const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Register a new user
router.post("/register", userController.register);

// Authenticate a user
router.post("/login", userController.login);

router.get("/:id/emergencyContacts", userController.getAllEmergencyContacts);

router.put("/:id/emergencyContact", userController.createEmergencyContact);

module.exports = router;
