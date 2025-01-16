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

// Route to retrieve document by doc_id
router.get("/getDocument/:doc_id", async (req, res) => {
  try {
    const { doc_id } = req.params;

    // Find document by doc_id
    const document = await Document.findOne({ "metadata.doc_id": doc_id });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json(document);
  } catch (error) {
    console.error("Error retrieving document:", error);
    res.status(500).json({ error: "Failed to retrieve document" });
  }
});

module.exports = router;
