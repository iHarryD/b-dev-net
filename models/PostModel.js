const mongoose = require("mongoose");

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
    type: String,
    required: true,
  },
  likes: {
    type: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users",
      },
    ],
  },
  uploadedOn: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("posts", PostSchema);
