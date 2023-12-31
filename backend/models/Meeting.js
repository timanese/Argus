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
  initiatedByEmergencyContact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  acceptedByEmergencyContact: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  phoneNumber: { type: String, required: true },
  location: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  status: {
    type: String,
    enum: ["Pending", "Scheduled", "Ongoing", "Completed"],
    default: "Pending",
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
