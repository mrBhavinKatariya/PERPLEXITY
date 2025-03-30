// models/AdminOverride.model.js
import mongoose from "mongoose";

const AdminOverrideSchema = new mongoose.Schema({
  isActive: { type: Boolean, default: false },
  forcedColor: { type: String, enum: ['red', 'green', 'violet'] },
  expiry: Date // Optional: ऑटो डिसेबल होने का समय
});

export const AdminOverride = mongoose.model('AdminOverride', AdminOverrideSchema);