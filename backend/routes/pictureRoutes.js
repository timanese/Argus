const express = require("express");
const router = express.Router();
const pictureController = require("../controllers/pictureController");

// Upload picture
router.post("/uploadFile", pictureController.uploadFile);

module.exports = router;
