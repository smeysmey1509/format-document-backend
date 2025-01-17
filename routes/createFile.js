const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Function to create a .scl file
const createSCLFile = (content, fileName) => {
  const filePath = path.join(__dirname, `../files/${fileName}.scl`); // Save in "files" folder
  const jsonString = JSON.stringify(content, null, 2);

  // Write content to the .scl file
  fs.writeFile(filePath, jsonString, (err) => {
    if (err) {
      console.error("Error creating .scl file:", err);
      return;
    }
    console.log(`File created successfully at ${filePath}`);
  });
};

// Endpoint to create and download the .scl file
router.post("/create", (req, res) => {
  const { jsonString, fileName } = req.body;

  if (!jsonString || !fileName) {
    return res.status(400).json({ error: "Missing jsonString or fileName" });
  }

  try {
    const content = JSON.parse(jsonString); // Parse the received JSON string
    createSCLFile(content, fileName);
    res.status(200).json({ message: "File created successfully" });
  } catch (err) {
    console.error("Error creating .scl file:", err);
    res.status(500).json({ error: "Failed to create .scl file" });
  }
});

module.exports = router;
