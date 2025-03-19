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
    selectedType: {
        type: String,
        enum: ['number', 'color'],
        required: true
      },
      selectedValue: {
        type: mongoose.Schema.Types.Mixed,
        required: true
      },

}, { timestamps: true });

export const BetHistory = mongoose.model("BetHistory", betHistorySchema);