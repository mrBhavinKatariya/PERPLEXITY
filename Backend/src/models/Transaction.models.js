
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
    },
    accountNumber: {
      type: String,
      required: true,
    },
    UPIId: {
      type: String,
      required: true,
    },
    ifsc: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^[A-Za-z]{4}0[A-Z0-9]{6}$/.test(v),
        message: "Invalid IFSC format",
      },
    },

  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);