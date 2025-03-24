import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto"; // Added missing crypto import
import { BetHistory } from "./History.models.js";

const bankAccountSchema = new Schema(
  {
    fundAccountId: {
      type: String,
      required: true,
    },
    last4: {
      type: String,
      required: true,
    },
    bankName: {
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

    isDefault: {
      type: Boolean,
      default: false,
    },
    addedOn: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    phoneNo: {
      type: String, // Changed from Number to String to preserve formatting
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    balance: {
      type: Number,
      default: 0,
    },
    betHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "BetHistory",
      },
    ],
    referralCode: { type: String, unique: true },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

    bankAccounts: [bankAccountSchema],

    passwordResetToken: {
      type: String,
    },

    passwordResetExpires: {
      type: Date,
    }, // Added missing field

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Password reset token methods

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.pre('save', async function(next) {
    if (!this.referralCode) {
      let isUnique = false;
      while (!isUnique) {
        const code = crypto.randomBytes(4).toString('hex').toUpperCase();
        const existingUser = await this.constructor.findOne({ referralCode: code });
        if (!existingUser) {
          this.referralCode = code;
          isUnique = true;
        }
      }
    }
    next();
  });
  

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Removed async from token generators (JWT is synchronous)
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    }
  );
};

export const User = mongoose.model("User", userSchema);
