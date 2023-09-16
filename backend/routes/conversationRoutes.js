const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");

// Initiate a new conversation
router.post("/", conversationController.initiate);

// List conversations for the logged-in user
router.get("/", conversationController.list);

// Send a new message in a conversation
router.post("/:id/messages", conversationController.sendMessage);

module.exports = router;
