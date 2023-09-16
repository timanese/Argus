const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

exports.register = async (req, res) => {
  const {
    username,
    email,
    phoneNumber,
    password,
    emergencyContacts,
    profilePicture,
    driversLicenseFront,
    driversLicenseBack,
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
      emergencyContacts,
      //   profilePicture: mongoose.Types.ObjectId(profilePicture),
      //   driversLicenseFront: mongoose.Types.ObjectId(driversLicenseFront),
      //   driversLicenseBack: mongoose.Types.ObjectId(driversLicenseBack),
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user in the database
    await user.save();

    // You can also generate and send a JWT token here if needed

    res.status(201).json({ msg: "User registered successfully" });
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
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
