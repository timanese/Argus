const crypto = require("crypto");
const Meeting = require("../models/Meeting");
const User = require("../models/User");
const twilioClient = require("../config/twilio");

// General-purpose function to upload GPS data
exports.uploadGPSData = async (meetingId, gpsLog) => {
  try {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      console.error("Meeting not found");
      return false;
    }

    // Add the GPS log to the gpsLogs array
    meeting.gpsLogs.push(gpsLog);

    await meeting.save();
    console.log("GPS log added successfully");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// Express middleware to handle HTTP request
exports.uploadGPS = async (req, res) => {
  const { meetingId } = req.params;
  const { gpsLog } = req.body;
  console.log(gpsLog);
  try {
    await uploadGPSData(meetingId, gpsLog);
    res.status(200).json({ msg: "GPS log added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// General-purpose function to upload audio data
exports.uploadAudioData = async (meetingId, fileId) => {
  try {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      console.error("Meeting not found");
      return false;
    }

    // Add the audio file ID to the audioLogs array
    meeting.audioLogs.push(fileId);

    await meeting.save();
    console.log("Audio successfully added");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// Express middleware to handle HTTP request
exports.uploadAudio = async (req, res) => {
  const { meetingId } = req.params;
  const fileId = req.body.fileId;

  try {
    await uploadAudioData(meetingId, fileId);
    res.status(200).json({ msg: "Audio successfully added" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.getAllMeetings = async (req, res) => {
  try {
    const { id } = req.params;

    const meetings = await Meeting.find({
      $or: [{ initiatedBy: id }, { acceptedBy: id }],
    })
      .populate("initiatedBy")
      .populate("acceptedBy"); // Optional: populate to get more user details

    if (!meetings || meetings.length === 0) {
      return res.status(404).json({ msg: "No meetings found for this user" });
    }

    res.status(200).json({ meetings });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.request = async (req, res) => {
  const {
    phoneNumber,
    meetingTitle,
    level,
    initiatedBy,
    initiatedByEmergencyContact,
    location,
    startTime,
  } = req.body;

  try {
    // Generate a unique identifier for the shareable URL
    const uniqueId = crypto.randomBytes(16).toString("hex");

    // Create a new meeting instance
    const meeting = new Meeting({
      uniqueId,
      meetingTitle,
      level,
      initiatedBy,
      initiatedByEmergencyContact,
      phoneNumber,
      location,
      startTime,
      status: "Pending", // Default status is set to 'pending'
    });

    console.log("Requesting meeting...");
    // Save the meeting in the database
    await meeting.save();

    // Create the shareable URL with meeting id as a query parameter
    const shareableUrl = bp.buildPath(`/acceptMeeting/${meeting._id}`);

    // Send the shareable URL via Twilio to the initiator's emergency contact
    const message = `You have a new meeting request. Click the link to view details: ${shareableUrl}. If you believe this message is in error, please reply STOP to unsubscribe.`;

    await twilioClient.messages.create({
      body: message,
      to: phoneNumber, // Replace with the actual phone number
      from: "+18335181680", // Replace with your Twilio phone number
    });

    // Respond with the meeting data and shareable URL
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
  const { acceptedBy, acceptedByEmergencyContact } = req.body;

  try {
    // Find the meeting by its ID
    const meeting = await Meeting.findById(id).populate("initiatedBy");

    // Check if the meeting exists
    if (!meeting) {
      return res.status(404).json({ msg: "Meeting not found" });
    }

    // Check if the meeting is already accepted
    if (meeting.status !== "Pending") {
      return res
        .status(400)
        .json({ msg: "Meeting is already accepted or completed" });
    }

    meeting.status = "Scheduled";
    meeting.acceptedBy = acceptedBy;
    meeting.acceptedByEmergencyContact = acceptedByEmergencyContact;

    // Update the meeting
    let acceptedByUser = await User.findById(acceptedBy);
    // This assumes that emergencyContacts is an array of objects and each object has an '_id' property
    let acceptedByEmergencyContactUser = await User.findById(
      acceptedByEmergencyContact
    );

    // Message to be sent to the initiator of the meeting
    const initiatorMessage = `Your meeting request has been accepted by ${acceptedByUser.firstName}. If you believe this message is in error, please reply STOP to unsubscribe.`;
    await twilioClient.messages.create({
      body: initiatorMessage,
      to: meeting.initiatedBy.phoneNumber ?? "+19542408181",
      from: "+18335181680",
    });

    const acceptedByEmergencyContactMessage = `Hello ${acceptedByEmergencyContactUser.firstName}, this message is to notify you that your friend ${acceptedByUser.firstName} has accepted a meeting request from ${meeting.initiatedBy.firstName}. If you believe this message is in error, please reply STOP to unsubscribe.`;

    await twilioClient.messages.create({
      body: acceptedByEmergencyContactMessage,
      to: acceptedByEmergencyContactUser.phoneNumber,
      from: "+18335181680",
    });

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
      .populate("initiatedBy")
      .populate("initiatedByEmergencyContact")
      .populate("acceptedBy")
      .populate("acceptedByEmergencyContact");

    if (!meeting) return res.status(404).json({ msg: "Meeting not found" });

    // const shareableId = crypto.randomBytes(16).toString("hex");
    // const shareableLink = `http://localhost:3000/emergency/${shareableId}`;

    const shareableLink = bp.buildPath(`/buddy/${id}`);
    const initiatedLink = bp.buildPath(`/meeting/${id}`);

    // Store the shareableId in the meeting model (You may want to do this)
    // meeting.uniqueId = shareableId;
    await meeting.save();

    const allContacts = [
      meeting.initiatedByEmergencyContact,
      meeting.acceptedByEmergencyContact,
    ];
    const allUsers = [meeting.initiatedBy, meeting.acceptedBy];

    // Send SMS
    for (let i = 0; i < allContacts.length; i++) {
      await twilioClient.messages.create({
        body: `Hello ${allContacts[i].firstName}, this is an Argus request from your friend ${allUsers[i].firstName}. If you believe this message is in error, please reply STOP to unsubscribe.\
        \n${allUsers[i].firstName} is scheduled to meet at ${meeting.location} at ${meeting.startTime}. Please click on \
        \nthe link below to follow their meetup and keep an eye on their safety.\n${shareableLink}`,
        to: allContacts[i].phoneNumber,
        from: "+18335181680",
      });
    }
    await twilioClient.messages.create({
      body: `Hello ${meeting?.initiatedBy?.firstName}, ${meeting?.acceptedBy?.firstName} has initiated the meeting, Please join him by clicking the link below\n ${initiatedLink}. If you believe this message is in error, please reply STOP to unsubscribe.`,
      to: allContacts[i].phoneNumber,
      from: "+18335181680",
    });

    res.status(200).json({ msg: "Initialization successful", shareableLink });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.complete = async (req, res) => {
  const { id } = req.params;

  try {
    const meeting = await Meeting.findById(id)
      .populate("initiatedBy", "emergencyContacts")
      .populate("acceptedBy", "emergencyContacts");

    if (!meeting) return res.status(404).json({ msg: "Meeting not found" });

    // Update meeting status
    meeting.status = "Completed";
    await meeting.save();

    // // Extract emergency contacts
    // const initiatorContacts = meeting.initiatedBy.emergencyContacts;
    // const acceptorContacts = meeting.acceptedBy.emergencyContacts;
    // const allContacts = [...initiatorContacts, ...acceptorContacts];

    // // Send SMS to inform contacts that parties are safe
    // for (const contact of allContacts) {
    //   await twilioClient.messages.create({
    //     body: `Safety Alert: The meeting between ${meeting.initiatedBy.firstName} and ${meeting.acceptedBy.firstName} has been safely completed.`,
    //     to: contact.phoneNumber,
    //     from: "+18449943470",
    //   });
    // }

    res.status(200).json({ msg: "Meeting successfully completed" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// Get a single meeting by ID
exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.status(200).json(meeting);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// console.log(uploadGPSData);

// module.exports = {
//   uploadGPSData,
//   // ... (other exported functions)
// };
