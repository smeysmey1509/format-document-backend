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

// Function to decrypt an existing file
const decryptExistingFile = (filePath, callback) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return callback(err);
    }

    try {
      // Decrypt the file data
      const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(ENCRYPTION_KEY, "hex"),
        Buffer.from(IV, "hex")
      );
      const decryptedData = Buffer.concat([
        decipher.update(data),
        decipher.final(),
      ]);

      // Optionally, save the decrypted data back to the file (overwriting encrypted content)
      fs.writeFile(filePath, decryptedData, (err) => {
        if (err) {
          return callback(err);
        }
        console.log(`File decrypted successfully at ${filePath}`);
        callback(null, decryptedData.toString("utf8")); // Return the decrypted content as UTF-8 string
      });
    } catch (error) {
      callback(error);
    }
  });
};

// Endpoint to decrypt an existing file
router.post("/decryptFile", (req, res) => {
  const { fileName } = req.body;

  if (!fileName) {
    return res.status(400).json({ error: "Missing fileName" });
  }

  const filePath = path.join(__dirname, `../files/${fileName}.scl`); // Path to the encrypted file

  decryptExistingFile(filePath, (err, decryptedContent) => {
    if (err) {
      if (err.code === "ENOENT") {
        return res.status(404).json({ error: "File not found" });
      }
      console.error("Error decrypting file:", err);
      return res.status(500).json({ error: "Failed to decrypt file" });
    }

    res
      .status(200)
      .json({
        message: "File decrypted successfully",
        content: decryptedContent,
      });
  });
});

module.exports = router;
