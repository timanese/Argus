const express = require("express");
const router = express.Router();
const postingController = require("../controllers/postingController");

// Create a new posting
router.post("/", postingController.create);

// Get all postings
router.get("/", postingController.getAll);

// Get a specific posting by ID
router.get("/:id", postingController.getById);

// Update a posting by ID
router.put("/:id", postingController.update);

// Delete a posting by ID
router.delete("/:id", postingController.delete);

module.exports = router;
