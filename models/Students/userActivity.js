// session.js

const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student Detail', // Reference to the user in studentDetails collection
    required: true,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  loginTime: {
    type: Date,
    default: null,
  },
  logoutTime: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model("Session", sessionSchema);
