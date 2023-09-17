const mongoose = require("mongoose");

const EmergencyContactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  location: { type: String },
  profilePicture: { type: mongoose.Schema.Types.ObjectId, ref: "fs.files" },
  driversLicenseFront: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "fs.files",
  },
  driversLicenseBack: { type: mongoose.Schema.Types.ObjectId, ref: "fs.files" },
  password: { type: String, required: true },
  emergencyContacts: [EmergencyContactSchema],
  exchangeHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exchange" }],
  optedInToNotifcations: { type: Boolean, required: false },
});

module.exports = mongoose.model("User", UserSchema);
