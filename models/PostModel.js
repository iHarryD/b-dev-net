const mongoose = require("mongoose");
const comment = require("./CommentModel");

const PostSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: true,
    max: 500,
  },
  media: {
    type: [String],
    max: 3,
  },
  postedBy: {
    type: {
      username: { type: String, required: true },
      fullName: { type: String, required: true },
      profilePictureSourceURL: { type: String },
    },
    required: true,
  },
  likes: {
    type: [String],
  },
  comments: {
    type: [comment],
  },
  uploadedOn: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("posts", PostSchema);
