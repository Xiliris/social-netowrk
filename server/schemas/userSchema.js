const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const userSchema = mongoose.Schema({
  email: reqString,
  username: reqString,
  password: reqString,
  active: {
    type: Boolean,
    required: true,
    default: false,
  },
  code: reqString,
});

module.exports = mongoose.model("user", userSchema);
