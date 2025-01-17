const express = require("express");
const router = express.Router();

// Function to encrypt JSON to Base64
const encryptJSONToBase64 = (jsonObject) => {
  try {
    const jsonString = JSON.stringify(jsonObject);
    const buffer = Buffer.from(jsonString, "utf8");
    return buffer.toString("base64");
  } catch (error) {
    console.error("Error encrypting JSON to Base64:", error);
    return null;
  }
};

// POST endpoint for Base64 encryption
router.post("/encryptToBase64", (req, res) => {
  const { jsonData } = req.body;

  if (!jsonData) {
    return res.status(400).json({ error: "JSON data is required." });
  }

  try {
    const base64Encoded = encryptJSONToBase64(jsonData);
    if (!base64Encoded) {
      throw new Error("Failed to encode JSON to Base64.");
    }

    res.status(200).json({ base64Encoded });
  } catch (error) {
    console.error("Error in /encryptToBase64:", error);
    res.status(500).json({ error: "Failed to encrypt JSON to Base64." });
  }
});

module.exports = router;
