
import mongoose from 'mongoose';
// models/GameSession.js

const gameSessionSchema = new mongoose.Schema({
  generatedNumber: { type: Number },
  color: String,
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['waiting', 'active', 'completed'], 
    default: 'waiting' 
  }
});

// Add compound index
gameSessionSchema.index({ status: 1, endTime: 1 });

export const GameSession =  mongoose.model('GameSession', gameSessionSchema);