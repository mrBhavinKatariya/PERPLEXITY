
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["deposit", "withdrawal"],
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
   
    transactionId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending","processing", "completed", "failed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);