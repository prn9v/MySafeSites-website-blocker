// models/BlockedSite.js

import mongoose from "mongoose";

const BlockedSiteSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

BlockedSiteSchema.index({ domain: 1, user: 1, group: 1 }, { unique: true });

export default mongoose.models.BlockedSite ||
  mongoose.model("BlockedSite", BlockedSiteSchema);