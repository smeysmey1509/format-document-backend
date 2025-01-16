// routes/document.js
const express = require("express");
const Document = require("../models/Document");

const router = express.Router();

// Route to save document
router.post("/saveDocument", async (req, res) => {
  try {
    const { metadata, content } = req.body;

    const newDocument = new Document({
      metadata,
      content
    });

    // Save the document to MongoDB
    const savedDocument = await newDocument.save();

    res.status(200).json({ message: "Document saved successfully", savedDocument });
  } catch (error) {
    console.error("Error saving document:", error);
    res.status(500).json({ error: "Failed to save document" });
  }
});

module.exports = router;
