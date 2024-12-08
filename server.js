const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const RegisterModel = require("./models/Register");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB

mongoose
  .connect("mongodb://127.0.0.1:27017/test")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

// Register Route

app.post("/formdata", (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  RegisterModel.findOne({ email })
    .then((user) => {
      if (user) {
        res.json({ message: "User already exists!" });
        return;
      }

      // Save the user without password hashing
      RegisterModel.create({ name, email, password })
        .then((result) => {
          res.json({ message: "Account created successfully", user: result });
        })
        .catch((err) => {
          res.json({ message: "Error saving user", error: err });
        });
    })
    .catch((err) => {
      res.json({ message: "Error checking user", error: err });
    });
});

// Start the server

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
