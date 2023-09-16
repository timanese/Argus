const mongoose = require("mongoose");

const ExchangeSchema = new mongoose.Schema({
  initiatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  status: {
    type: String,
    enum: ["pending", "ongoing", "completed"],
    default: "pending",
  },
  audioLogs: [{ type: String }], // URLs or IDs of audio files
  gpsLogs: [{ type: String }], // GPS coordinates as strings
});

module.exports = mongoose.model("Exchange", ExchangeSchema);
