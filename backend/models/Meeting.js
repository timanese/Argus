const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  uniqueId: { type: String, required: true },
  meetingTitle: { type: String, required: true },
  level: { type: String, enum: ["1", "2"], required: true },
  initiatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  location: {
    lat: { type: String },
    long: { type: String },
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  status: {
    type: String,
    enum: ["pending", "ongoing", "completed"],
    default: "pending",
  },
  audioLogs: [{ type: String }], // URLs or IDs of audio files
  gpsLogs: [
    {
      lat: { type: String },
      long: { type: String },
    },
  ],
  timeLogs: [{ type: Date }],
});

module.exports = mongoose.model("Meeting", MeetingSchema);
