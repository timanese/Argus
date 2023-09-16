const crypto = require("crypto");
const Meeting = require("../models/Meeting");

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

exports.share = async (req, res) => {
  const { uniqueId } = req.params;

  try {
    // Find the meeting by its unique ID
    let meeting = await Meeting.findOne({ uniqueId });

    // Check if the meeting exists
    if (!meeting) {
      return res.status(404).json({ msg: "Meeting not found" });
    }

    // Logic for checking user's login status and redirecting appropriately
    if (req.user) {
      // If the middleware sets req.user, the user is authenticated
      // User is logged in, redirect them to the pending meeting details page
      const redirectUrl = `/meetings/pending/${uniqueId}`;
      return res
        .status(200)
        .json({ msg: "User is logged in, redirecting", redirectUrl });
    } else {
      // User is not logged in, redirect them to the login page with a `redirect_uri` parameter
      const redirectUrl = `/login?redirect_uri=/meetings/pending/${uniqueId}`;
      return res.status(200).json({
        msg: "User is not logged in, redirecting to login",
        redirectUrl,
      });
    }
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
  // TODO: Implement logic to initiate the actual meeting
};

exports.complete = async (req, res) => {
  // TODO: Implement logic to mark an meeting as complete
};
