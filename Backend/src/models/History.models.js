import mongoose, { Schema } from "mongoose";

const betHistorySchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    betAmount: {
        type: Number,
        required: true
    },
    selectedColor: {
        type: String,
        required: true
    },
    randomNumber: {
        type: Number,
        required: true
    },
    multiplier: {
        type: Number,
        required: true
    },
    result: {
        type: String,
        enum: ["WIN", "LOSS"],
        required: true
    },
    winnings:{
        type: Number,
        required: true
    },
    createdAt: { type: Date, default: Date.now },

}, { timestamps: true });


betHistorySchema.index({ userId: 1, createdAt: -1 });

export const BetHistory = mongoose.model("BetHistory", betHistorySchema);


// models/Bet.js
// import mongoose from 'mongoose';

// const betHistorySchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   gameSession: { type: mongoose.Schema.Types.ObjectId, ref: 'GameSession', required: true },
//   amount: { type: Number, required: true },
//   betType: { type: String, enum: ['color', 'digit'], required: true },
//   selection: { type: String, required: true },
//   outcome: { type: String, enum: ['win', 'loss'], required: true },
//   payout: { type: Number, required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// export const BetHistory = mongoose.model('BetHistory', betHistorySchema);