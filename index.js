// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const FileManagement = require("./routes/FileManagement"); // Import create file routes
const encryptRoutes = require("./routes/encrypt"); // Import encrypt routes

const app = express();

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Use routes
app.use("/api", FileManagement);
app.use("/api", encryptRoutes)



// Start server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});