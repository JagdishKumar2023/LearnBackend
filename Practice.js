const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ResgisterModel = require("./models/Register");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/formdata")
  .then(() => {
    console.log("Mongodb connection is succssfully ✔️");
  })
  .catch((err) => {
    console.log("Error in mongodb connection", err);
  });

app.post("/formdata", (req, res) => {
  const { name, email, password } = req.body;
  ResgisterModel.findOne({ email })
    .then((user) => {
      if (user) {
        res.json({ message: "User is already exists" });
        return;
      }
      ResgisterModel.create({ name, email, password })
        .then((result) => {
          res.json({ message: "User is created successfully", result });
        })
        .catch((err) => res.json({ message: "Error checking user", err }));
    })
    .catch((err) => {
      res.json({ message: "Problem in internal server", err });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running in ${PORT} port`);
});
