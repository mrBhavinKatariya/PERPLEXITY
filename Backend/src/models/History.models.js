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

