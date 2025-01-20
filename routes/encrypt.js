const express = require("express");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const crypto = require("crypto");

const router = express.Router();

// Encryption key and IV (use environment variables for production)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"; // 32-byte key
const IV = process.env.IV || "abcdef1234567890abcdef1234567890"; // 16-byte IV

// Function to decrypt and decompress the file
const decryptAndDecompress = (filePath, callback) => {
  fs.readFile(filePath, (err, encryptedData) => {
    if (err) {
      return callback(err);
    }

    try {
      const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), Buffer.from(IV, "hex"));
      const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

      zlib.inflate(decryptedData, (err, decompressedData) => {
        if (err) {
          return callback(err);
        }

        callback(null, JSON.parse(decompressedData.toString()));
      });
    } catch (error) {
      callback(error);
    }
  });
};

// Function to compress and encrypt content, and save it to a file
const compressEncryptAndSave = (content, filePath, callback) => {
  try {
    const jsonString = JSON.stringify(content);

    zlib.deflate(jsonString, (err, compressedData) => {
      if (err) {
        return callback(err);
      }

      const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), Buffer.from(IV, "hex"));
      const encryptedData = Buffer.concat([cipher.update(compressedData), cipher.final()]);

      fs.writeFile(filePath, encryptedData, (err) => {
        if (err) {
          return callback(err);
        }

        callback(null);
      });
    });
  } catch (error) {
    callback(error);
  }
};

// Endpoint to append content to an existing encrypted file
router.post("/append", (req, res) => {
  const { fileName, newContent } = req.body;

  if (!fileName || !newContent) {
    return res.status(400).json({ error: "Missing fileName or newContent" });
  }

  const filePath = path.join(__dirname, `../files/${fileName}.scl`);

  // Read, decrypt, append, compress, and save
  decryptAndDecompress(filePath, (err, existingContent) => {
    if (err) {
      if (err.code === "ENOENT") {
        return res.status(404).json({ error: "File not found" });
      }
      return res.status(500).json({ error: "Failed to read or decrypt the file" });
    }

    // Append new content
    const updatedContent = {
      ...existingContent,
      content: {
        ...existingContent.content,
        appended: newContent,
      },
    };

    compressEncryptAndSave(updatedContent, filePath, (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update and save the file" });
      }

      res.status(200).json({ message: "File updated successfully" });
    });
  });
});

module.exports = router;
