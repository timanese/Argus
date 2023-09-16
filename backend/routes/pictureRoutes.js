const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");

// Upload picture
router.post("/uploadFile", fileController.uploadFile);

module.exports = router;
