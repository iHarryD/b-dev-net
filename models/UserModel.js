const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  profilePictureSourceURL: {
    type: String,
  },
  bio: {
    type: String,
    max: 100,
  },
  password: {
    type: String,
    min: 6,
    required: true,
  },
  bookmarks: {
    type: [mongoose.SchemaTypes.ObjectId],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("users", UserSchema);
