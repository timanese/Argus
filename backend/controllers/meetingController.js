const crypto = require("crypto");
const Meeting = require("../models/Meeting");
const User = require("../models/User");
const twilioClient = require("../config/twilio");

exports.uploadGPS = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { gpsLog } = req.body;
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) return res.status(404).json({ msg: "Meeting not found" });

    // Add the GPS log to the gpsLogs array
    meeting.gpsLogs.push(gpsLog);

    await meeting.save();
    res.status(200).json({ msg: "GPS log added successfully", meeting });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.uploadAudioBlob = async (req, res) => {
  const { meetingId } = req.params;
  const fileId = req.body.fileId;

  try {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) return res.status(404).json({ msg: "Meeting not found" });

    meeting.audioLogs.push(fileId);
    await meeting.save();

    res.status(200).json({ msg: "Audio successfully added", meeting });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.request = async (req, res) => {
  const { level, initiatedBy, location, startTime } = req.body;

  try {
    // Generate a unique identifier for the shareable URL
    const uniqueId = crypto.randomBytes(16).toString("hex");

    // Create a new meeting instance
    const meeting = new Meeting({
      uniqueId,
      level,
      initiatedBy,
      location,
      startTime,
      status: "pending", // Default status is set to 'pending'
    });

    // Save the meeting in the database
    await meeting.save();

    // Create the shareable URL
    const shareableUrl = `http://localhost:3001/api/meetings/share/${uniqueId}`;

    // Ideally, you would associate this uniqueId with the meeting record in the database for later retrieval.

    res
      .status(201)
      .json({ msg: "Meeting requested successfully", meeting, shareableUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.accept = async (req, res) => {
  const { id } = req.params;
  const { acceptedBy } = req.body;

  try {
    // Find the meeting by its ID
    let meeting = await Meeting.findById(id);

    // Check if the meeting exists
    if (!meeting) {
      return res.status(404).json({ msg: "Meeting not found" });
    }

    // Check if the meeting is already accepted
    if (meeting.status !== "pending") {
      return res
        .status(400)
        .json({ msg: "Meeting is already accepted or completed" });
    }

    // Update the meeting
    meeting.acceptedBy = acceptedBy;
    meeting.status = "ongoing";

    // Save the updated meeting
    await meeting.save();

    res.status(200).json({ msg: "Meeting accepted successfully", meeting });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.initiate = async (req, res) => {
  const { id } = req.params;

  try {
    const meeting = await Meeting.findById(id)
      .populate("initiatedBy", "emergencyContacts")
      .populate("acceptedBy", "emergencyContacts");

    if (!meeting) return res.status(404).json({ msg: "Meeting not found" });

    const shareableId = crypto.randomBytes(16).toString("hex");
    const shareableLink = `http://localhost:3000/emergency/${shareableId}`;

    // Store the shareableId in the meeting model (You may want to do this)
    meeting.uniqueId = shareableId;
    await meeting.save();

    const initiatorContacts = meeting.initiatedBy.emergencyContacts;
    const acceptorContacts = meeting.acceptedBy.emergencyContacts;
    const allContacts = [...initiatorContacts, ...acceptorContacts];
    console.log(allContacts);

    // Send SMS
    for (const contact of allContacts) {
      await twilioClient.messages.create({
        body: `Emergency Alert: You can view the audio and GPS logs for this meeting here: ${shareableLink}`,
        to: contact.phoneNumber,
        from: "+15005550006",
      });
    }

    res.status(200).json({ msg: "Initialization successful", shareableLink });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.complete = async (req, res) => {
  const { meetingId } = req.params;

  try {
    const meeting = await Meeting.findById(meetingId)
      .populate("initiatedBy", "emergencyContacts")
      .populate("acceptedBy", "emergencyContacts");

    if (!meeting) return res.status(404).json({ msg: "Meeting not found" });

    // Update meeting status
    meeting.status = "completed";
    await meeting.save();

    // Extract emergency contacts
    const initiatorContacts = meeting.initiatedBy.emergencyContacts;
    const acceptorContacts = meeting.acceptedBy.emergencyContacts;
    const allContacts = [...initiatorContacts, ...acceptorContacts];

    // Send SMS to inform contacts that parties are safe
    for (const contact of allContacts) {
      await twilioClient.messages.create({
        body: `Safety Alert: The meeting between ${meeting.initiatedBy.username} and ${meeting.acceptedBy.username} has been safely completed.`,
        to: contact.phoneNumber,
        from: "+18449943470",
      });
    }

    res.status(200).json({ msg: "Meeting successfully completed" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
