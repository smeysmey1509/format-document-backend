// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db"); // Import DB connection
const documentRoutes = require("./routes/document"); // Import document routes
const encryptRoutes = require("./routes/encrypt"); // Import encrypt routes
const createFileRoutes = require("./routes/createFile"); // Import create file routes

const app = express();

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Use routes
app.use("/api/documents", documentRoutes);
app.use("/api/encrypt", encryptRoutes);
app.use("api/create", createFileRoutes);

// Start server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});