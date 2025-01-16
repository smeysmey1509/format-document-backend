// server.js (Updated to use routes)
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db"); // Import DB connection
const documentRoutes = require("./routes/document"); // Import routes

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Use routes
app.use("/api/documents", documentRoutes);

// Start server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
