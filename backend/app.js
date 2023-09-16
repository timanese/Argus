const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
require("dotenv").config();

// Initialize Express app
const app = express();

// Import socket handler
const socketHandler = require('./controllers/socketHandler.js'); // Replace with the actual path to your socketHandler.js

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create an HTTP server instance with your Express app
const server = http.createServer(app);
const io = require('socket.io')(server);

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

// Export the server instance so you can use it elsewhere
module.exports = server;
