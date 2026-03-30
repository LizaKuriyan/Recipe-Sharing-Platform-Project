const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["Blocked", "Unblocked"],
      default: "Unblocked"
    },

    isAdmin: {
      type: Boolean,
      default: false
    },

    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;