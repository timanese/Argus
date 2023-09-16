const mongoose = require("mongoose");

const EmergencyContactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emergencyContacts: [EmergencyContactSchema],
  exchangeHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exchange" }],
});

module.exports = mongoose.model("User", UserSchema);
