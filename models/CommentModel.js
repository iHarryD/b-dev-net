const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  commentedBy: {
    type: {
      username: { type: String, required: true },
      fullName: { type: String, required: true },
      profilePictureSourceURL: { type: String },
    },
    required: true,
  },
  comment: {
    type: String,
    max: 100,
    required: true,
  },
  commentedOn: {
    type: Date,
    default: new Date(),
  },
});

module.exports = CommentSchema;
