const mongoose = require("mongoose");

const ConnectionSchema = new mongoose.Schema({
  connectionBetween: {
    type: [String, String],
    required: true,
  },
  initiatedBy: {
    type: String,
    required: true,
  },
  connectionAccepted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("connections", ConnectionSchema);
