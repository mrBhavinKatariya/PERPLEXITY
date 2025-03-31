// models/AdminOverride.models.js
import mongoose from "mongoose";

const adminOverrideSchema = new mongoose.Schema({
  value: { 
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["number", "color"],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const AdminOverride = mongoose.model("AdminOverride", adminOverrideSchema);