const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware to check and serve brotli compressed files
app.use((req, res, next) => {
  // Check if the request is for a brotli compressed file
  if (req.url.endsWith(".br")) {
    // Set Brotli content-encoding header
    res.setHeader("Content-Encoding", "br");

    // If you're serving compressed JavaScript or CSS files,
    // you'll want to ensure that the MIME type is set correctly:
    if (req.url.endsWith(".js.br")) {
      res.setHeader("Content-Type", "application/javascript");
    } else if (req.url.endsWith(".css.br")) {
      res.setHeader("Content-Type", "text/css");
    }
    // ... Add more types as necessary

    // Ensure that the correct brotli compressed file is served
    const originalUrl = req.url; // .slice(0, -3); // Remove .br from the URL to get the original file name
    const filePath = path.join(__dirname, originalUrl);

    // Check if the file exists before proceeding
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send("File not found");
    }
  } else {
    next();
  }
});

// Serve static files
app.use(express.static("."));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
