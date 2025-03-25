// models/GameSession.js
import mongoose from 'mongoose';

const gameSessionSchema = new mongoose.Schema({
  generatedNumber: { type: Number, required: true },
  color: String,
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['active', 'completed'], default: 'active' }
});

gameSessionSchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

export const GameSession =  mongoose.model('GameSession', gameSessionSchema);