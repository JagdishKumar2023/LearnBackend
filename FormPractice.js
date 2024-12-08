const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/FormPractice")
  .then(() => {
    console.log("mongodb is connected to the data base");
  })
  .catch((err) => {
    console.log("mongodb is error is connected", err);
  });

const formDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const UserSchema = mongoose.model("FormPractice", formDataSchema);

app.post("/FormPractice", (req, res) => {
  const { name, email, password } = req.body;
  UserSchema.find({ email })
    .then((user) => {
      if (user.length > 0) {
        res.json({ message: "User already exists" });
        return;
      }
      UserSchema.create({ name, email, password })
        .then((result) => {
          res.json({ message: "User created successfully", result });
        })
        .catch((err) => {
          res.status(500).json({ message: "Error in creating user", err });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

const PORT = 4002;
app.listen(PORT, () => {
  console.log(`server is running in ${PORT}`);
});
