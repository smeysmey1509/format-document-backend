const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const PDFParser = require("pdf2json");

const router = express.Router();

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

// Function to generate TipTap-compatible JSON
const generateTipTapJson = (text) => {
  const lines = text.split("\n").filter((line) => line.trim() !== "");

  return {
    type: "doc",
    content: lines.map((line) => ({
      type: "paragraph",
      content: [
        {
          type: "text",
          text: line,
        },
      ],
    })),
  };
};

// Endpoint to convert a PDF to TipTap JSON
router.post("/convertPdfToTipTapJson", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = path.join(__dirname, req.file.path);

  const pdfParserInstance = new PDFParser();

  pdfParserInstance.on("pdfParser_dataError", (errData) => {
    console.error("Error parsing PDF:", errData.parserError);
    res.status(500).json({ error: "Failed to process PDF", details: errData });
  });

  pdfParserInstance.on("pdfParser_dataReady", (pdfData) => {
    try {
      // Extract text from the parsed PDF data
      const text = pdfData.formImage.Pages.map((page) =>
        page.Texts.map((textObj) => decodeURIComponent(textObj.T)).join(" ")
      ).join("\n");

      // Generate TipTap JSON from PDF content
      const tipTapJson = generateTipTapJson(text);

      // Respond with the TipTap JSON
      res.status(200).json(tipTapJson);
    } catch (error) {
      console.error("Error processing PDF:", error);
      res.status(500).json({ error: "Failed to process PDF" });
    } finally {
      // Delete the uploaded file after processing
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  });

  // Start parsing the uploaded PDF
  pdfParserInstance.loadPDF(filePath);
});

module.exports = router;
