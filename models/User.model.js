const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      match: [
        /^[A-Za-z0-9\s]+$/,
        "Username can contains only letters (A-Z a-z) digits (0-9) and spaces.",
      ],
      unique: true,
      trim: true,
      minlength: [4, "Username must have min 4 characters"],
      maxlength: [16, "Username can have max 16 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address."],
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
