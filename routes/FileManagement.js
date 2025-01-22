const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Function to create an empty .scl file
const createEmptySCLFile = (fileName, callback) => {
  const filePath = path.join(__dirname, `../files/${fileName}.scl`); // Save in "files" folder

  // Create an empty file
  fs.writeFile(filePath, "", (err) => {
    if (err) {
      console.error(`Error creating .scl file:`, err);
      return callback(err);
    }
    console.log(`Empty file created successfully at ${filePath}`);
    callback(null, filePath);
  });
};

// Function to read the content of an .scl file
const readSCLFile = (fileName, callback) => {
  const filePath = path.join(__dirname, `../files/${fileName}.scl`);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading ${fileName}.scl file:`, err);
      return callback(err);
    }
    callback(null, data);
  });
};

// Function to write content to an .scl file
const writeSCLFile = (fileName, content, callback) => {
  const filePath = path.join(__dirname, `../files/${fileName}.scl`);

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error(`Error writing to ${fileName}.scl file:`, err);
      return callback(err);
    }
    callback(null);
  });
};

// Endpoint to create an empty .scl file
router.post("/createFile", (req, res) => {
  const { fileName } = req.body;

  if (!fileName) {
    return res.status(400).json({ error: "Missing fileName" });
  }

  try {
    createEmptySCLFile(fileName, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to create .scl file" });
      }
      res.status(200).json({ message: "File created successfully" });
    });
  } catch (err) {
    console.error(`Error creating ${fileName}.scl file:`, err);
    res.status(500).json({ error: "Failed to create .scl file" });
  }
});

// Endpoint to read the content of an .scl file
router.get("/readFile/:fileName", (req, res) => {
  const { fileName } = req.params;

  try {
    readSCLFile(fileName, (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ error: `Failed to read ${fileName}.scl file` });
      }
      res.status(200).json({ content: data });
    });
  } catch (err) {
    console.error(`Error reading ${fileName}.scl file:`, err);
    res.status(500).json({ error: `Failed to read ${fileName}.scl file` });
  }
});

// Endpoint to write content to an .scl file
router.post("/writeFile", (req, res) => {
  const { fileName, content } = req.body;

  if (!fileName || !content) {
    return res.status(400).json({ error: "Missing fileName or content" });
  }

  try {
    writeSCLFile(fileName, content, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: `Failed to write to ${fileName}.scl file` });
      }
      res.status(200).json({ message: "File written successfully" });
    });
  } catch (err) {
    console.error(`Error writing to ${fileName}.scl file:`, err);
    res.status(500).json({ error: `Failed to write to ${fileName}.scl file` });
  }
});

module.exports = router;
