const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const reqArray = {
  type: Array,
  required: true,
};

const profileSchema = mongoose.Schema({
  email: reqString,
  username: reqString,
  avatar: reqString,
  friends: reqArray,
});

module.exports = mongoose.model("profile", profileSchema);
