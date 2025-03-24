import mongoose, { Schema } from "mongoose";

const referralEarningSchema = new mongoose.Schema({

  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  referredUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
 
  amount: {
    type: Number,
    required: true
  },
 
  orderId: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});


export const ReferralEarning = mongoose.model("ReferralEarning", referralEarningSchema);
