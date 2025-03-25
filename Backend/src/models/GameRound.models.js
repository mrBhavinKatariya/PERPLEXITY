
import mongoose, { Schema } from "mongoose";

const gameRoundSchema = new mongoose.Schema({
    roundNumber: { type: Number, required: true, unique: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    result: Number,
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
  });
  export const GameRound = mongoose.model('GameRound', gameRoundSchema);