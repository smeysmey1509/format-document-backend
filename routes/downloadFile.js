const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/downloadFile/:fileName", (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(__dirname, "../files", fileName); // Update with your file storage path

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send("Failed to download file");
    }
  });
});

module.exports = router;
