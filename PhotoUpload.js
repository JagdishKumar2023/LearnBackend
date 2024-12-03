const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/upload")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define a schema and model for file metadata
const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});

const File = mongoose.model("File", fileSchema);

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Image"); // Save files in "public/Image"
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage });

// File upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    // Save file metadata to MongoDB
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
    res.status(500).json({ error: "Server error while saving file metadata." });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
