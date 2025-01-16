const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection URI
const uri =
  "mongodb+srv://dbFormat:123@cluster0.6okor.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Establish MongoDB connection
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully.");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

// Schema and Model Setup
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

const metadataSchema = new mongoose.Schema({
  doc_id: { type: Number, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  created_date: { type: String, required: true },
  last_modified: { type: String, required: true },
  version: { type: String, required: true },
  icon: { type: String, required: true },
});

const documentSchema = new mongoose.Schema({
  metadata: { type: metadataSchema, required: true },
  content: { type: [contentSchema], required: true },
});

const Document = mongoose.model("Document", documentSchema);

// Route to save document
app.post("/saveDocument", async (req, res) => {
  try {
    const { metadata, content } = req.body;

    const newDocument = new Document({
      metadata,
      content,
    });

    // Save the document to MongoDB
    const savedDocument = await newDocument.save();

    res
      .status(200)
      .json({ message: "Document saved successfully", savedDocument });
  } catch (error) {
    console.error("Error saving document:", error);
    res.status(500).json({ error: "Failed to save document" });
  }
});

// Start server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
