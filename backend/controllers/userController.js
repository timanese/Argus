const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const Meeting = require("../models/Meeting");
const { uploadFile } = require("./fileController"); // Import the uploadPicture function

exports.register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    emergencyContacts,
    profilePictureId,
    driversLicenseFrontId,
    driversLicenseBackId,
    optedInToNotifcations,
  } = req.body;

  try {
    console.log("registering");
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create a new user instance
    user = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      emergencyContacts: emergencyContacts ?? [],
      profilePictureId,
      driversLicenseFrontId,
      driversLicenseBackId,
      optedInToNotifcations,
    });

    if (!password) {
      return res.status(400).json({ msg: "Password is required" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user in the database
    await user.save();

    let { pass, ...rest } = user._doc;
    rest.password = "";
    rest._id = user._doc._id;
    rest.id = user._doc._id;
    res.json(rest);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const { pass, ...rest } = user._doc;
    rest.password = "";
    rest._id = user._doc._id;
    rest.id = user._doc._id;
    res.json({ user: rest });
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

    // Create a new user for the emergency contact
    let newEmergencyUser = await User.findOne({ phoneNumber });

    if (!newEmergencyUser) {
      // Generate a random password (you could also send this to the user)
      const password = Math.random().toString(36).slice(-8);

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create the new user
      newEmergencyUser = new User({
        firstName,
        lastName,
        phoneNumber,
        password: hashedPassword,
        email: Math.random().toString(36).slice(-8),
        // Add other default fields if needed
      });

      await newEmergencyUser.save();
    }

    // Add the new contact to the existing user's emergency contacts
    user.emergencyContacts.push(newEmergencyUser);
    await user.save();

    res.json({
      newContact,
      newEmergencyUser,
      msg: "Emergency contact and new user created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
