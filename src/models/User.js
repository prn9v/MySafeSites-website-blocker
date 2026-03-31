// models/User.js

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: function () {
        return this.provider === "credentials";
      },
      select: false,
    },

    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },

    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },

    provider: {
      type: String,
      enum: ["credentials", "google", "github"],
      default: "credentials",
    },

    providerId: String,
    image: String,
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
