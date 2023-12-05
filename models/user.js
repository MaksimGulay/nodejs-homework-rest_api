// models/user.js

const mongoose = require("mongoose");

const gravatar = require("gravatar");

const userShema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
      default: null,
    },
  },
  { versionKey: false }
);

userShema.pre("save", async function (next) {
  if (this.isModified("email")) {
    this.avatarURL = gravatar.url(this.email, { s: "250", d: "retro" }, true);
  }
  next();
});

module.exports = mongoose.model("User", userShema);
