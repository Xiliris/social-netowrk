const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const reqNumber = {
  type: Number,
  required: true,
};

const postSchema = mongoose.Schema({
  username: reqString,
  email: reqString,
  image: reqString,
  likes: reqNumber,
  dislikes: reqNumber,
  title: reqString,
  comment: reqString,
  date: {
    type: Date,
    required: true,
  },
  userInteractionLike: {
    type: Array,
    required: true,
  },
  userInteractionDislike: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("post", postSchema);
