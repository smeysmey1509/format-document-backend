const mongoose = require("mongoose");

// Schema for content section
const contentSchema = new mongoose.Schema({
  type: { type: String, required: true },
  content: [
    {
      type: { type: String, required: true },
      attrs: {
        level: { type: Number, required: false },
      },
      text: { type: String, required: false },
      marks: [
        {
          type: { type: String, required: true },
        },
      ],
    },
  ],
});

// Schema for metadata section
const metadataSchema = new mongoose.Schema({
  doc_id: { type: Number, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  created_date: { type: String, required: true },
  last_modified: { type: String, required: true },
  version: { type: String, required: true },
  icon: { type: String, required: true },
});

// Main document schema (combining metadata and content)
const documentSchema = new mongoose.Schema({
  metadata: { type: metadataSchema, required: true },
  content: { type: [contentSchema], required: true },
});

// Model creation
const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
