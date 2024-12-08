const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable cross-origin requests
app.use(express.json()); // Parse JSON requests

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/upload")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// File metadata schema
const fileSchema = new mongoose.Schema({
  originalName: String,
  filePath: String,
  uploadDate: { type: Date, default: Date.now },
});

const File = mongoose.model("File", fileSchema);

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Image"); // Directory to store files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// File upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded." });

  try {
    const newFile = new File({
      originalName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`,
    });
    await newFile.save();

    res.status(201).json({
      message: "File uploaded successfully!",
      filePath: newFile.filePath,
    });
  } catch (error) {
    console.error("Error saving file metadata:", error);
    res.status(500).json({ error: "Error saving file metadata." });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
