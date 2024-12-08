const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const ResgisterModel = mongoose.model("formdata", registerSchema);
module.exports = ResgisterModel;
