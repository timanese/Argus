const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const { uploadFile } = require("./fileController"); // Import the uploadPicture function

exports.register = async (req, res) => {
  const {
    username,
    email,
    phoneNumber,
    password,
    emergencyContacts,
    profilePictureId,
    driversLicenseFrontId,
    driversLicenseBackId,
  } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create a new user instance
    user = new User({
      username,
      email,
      phoneNumber,
      password,
      emergencyContacts: emergencyContacts ?? [],
      profilePictureId,
      driversLicenseFrontId,
      driversLicenseBackId,
    });

    if (!password) {
      return res.status(400).json({ msg: "Password is required" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user in the database
    await user.save();

    // Sign the token
    const payload = {
      id: user.id,
      username: user.username,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, id: user.id, username: user.username });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Sign the token
    const payload = {
      id: user.id,
      username: user.username,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, id: user.id, username: user.username });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.getAllEmergencyContacts = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("emergencyContacts");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user.emergencyContacts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.createEmergencyContact = async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, phoneNumber } = req.body;
    const newContact = { firstName, lastName, phoneNumber };

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.emergencyContacts.push(newContact);
    await user.save();

    res.json(newContact);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
