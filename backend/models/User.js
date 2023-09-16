const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  emergencyContact: { type: String },
  exchangeHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exchange" }],
});

module.exports = mongoose.model("User", UserSchema);
