const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = mongoose.Schema({
  user_name: String,
  email: String,
  password: String,
});

module.exports = mongoose.model("User", userSchema);