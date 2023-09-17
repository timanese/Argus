const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const path = require("path");
require("dotenv").config();
var bp = require("./Path.js");
// Initialize Express app
const app = express();

// Import socket handler
const socketHandler = require("./controllers/socketHandler.js"); // Replace with the actual path to your socketHandler.js

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: bp.buildPath(""),  // replace with your application's origin
  credentials: true  // <-- Add this line
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create an HTTP server instance with your Express app
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: bp.buildPath(""),  // replace with your application's origin
    methods: ["GET", "POST"],
    credentials: true  // <-- Add this line
  },
  maxHttpBufferSize: 1e8 // 100 MB
});

// Initialize your socketHandler here
socketHandler(io);

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/pictures", require("./routes/pictureRoutes"));
app.use("/api/meetings", require("./routes/meetingRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Server static assets if in production
if (process.env.MODE === "production") {
  console.log("Started in production mode.");
  let path_ = path.join(__dirname, "../", "client", "build");
  console.log("Looking for build path at", path_);
  app.use(express.static(path_));
  app.get("/*", function (req, res) {
    res.sendFile(
      path.join(__dirname, "../", "client", "build", "index.html")
    );
  });
}

// Export the server instance so you can use it elsewhere
module.exports = server;
