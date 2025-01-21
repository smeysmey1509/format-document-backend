const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const router = express.Router();

// Encryption key and IV (use environment variables for production)
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY ||
  "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"; // 32-byte key
const IV = process.env.IV || "abcdef1234567890abcdef1234567890"; // 16-byte IV

// Function to encrypt an existing file
const encryptExistingFile = (filePath, callback) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return callback(err);
    }

    try {
      // Encrypt the file data
      const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(ENCRYPTION_KEY, "hex"),
        Buffer.from(IV, "hex")
      );
      const encryptedData = Buffer.concat([
        cipher.update(data),
        cipher.final(),
      ]);

      // Overwrite the file with the encrypted data
      fs.writeFile(filePath, encryptedData, (err) => {
        if (err) {
          return callback(err);
        }
        console.log(`File encrypted successfully at ${filePath}`);
        callback(null);
      });
    } catch (error) {
      callback(error);
    }
  });
};

// Endpoint to encrypt an existing file
router.post("/encryptFile", (req, res) => {
  const { fileName } = req.body;

  if (!fileName) {
    return res.status(400).json({ error: "Missing fileName" });
  }

  const filePath = path.join(__dirname, `../files/${fileName}.scl`); // Path to the existing file

  encryptExistingFile(filePath, (err) => {
    if (err) {
      if (err.code === "ENOENT") {
        return res.status(404).json({ error: "File not found" });
      }
      console.error("Error encrypting file:", err);
      return res.status(500).json({ error: "Failed to encrypt file" });
    }

    res.status(200).json({ message: "File encrypted successfully" });
  });
});

module.exports = router;
