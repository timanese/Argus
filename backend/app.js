const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/postings", require("./routes/postingRoutes"));
app.use("/api/conversations", require("./routes/conversationRoutes"));
app.use("/api/exchanges", require("./routes/exchangeRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
