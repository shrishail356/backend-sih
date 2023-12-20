const mongoose = require("mongoose");

const studentCredential = new mongoose.Schema({
  loginid: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  ipAddress: {
    type: String,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model("Student Credential", studentCredential);
