import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Prediction } from "../models/storeNumber.models.js";
import { UTRNumber } from "../models/UTRNumber.models.js";
import { User } from "../models/user.models.js";
import { BetHistory } from "../models/History.models.js";
import { Transaction } from "../models/Transaction.models.js";
import mongoose from "mongoose";
import Razorpay from "razorpay"; // Import Razorpay
import crypto from "crypto";
import dotenv from "dotenv";


dotenv.config()
let isGenerating = false;
let countdownStartTime = Date.now();

// Function to generate a secure random number between 0 and 9
const generateSecureRandomNumber = () => {
  return crypto.randomInt(0, 10); // Generates a number between 0 and 9
};

const handleRandomNumberGeneration = async () => {
  if (!isGenerating) {
    isGenerating = true;
    try {
      const lastRecord = await Prediction.findOne().sort({ createdAt: -1 });

      let currentNumber;
      let nextNumber;

      // Debugging: Log the last record
      console.log("Last Record:", lastRecord);

      if (lastRecord) {
        // If lastRecord.nextNumber is missing, generate a new random number
        currentNumber = lastRecord.nextNumber || generateSecureRandomNumber();
        nextNumber = generateSecureRandomNumber();
      } else {
        // If no lastRecord exists, generate both numbers
        currentNumber = generateSecureRandomNumber();
        nextNumber = generateSecureRandomNumber();
      }

      const period = lastRecord ? lastRecord.period + 1 : 1;

      // Validate currentNumber and result
      if (typeof currentNumber !== 'number' || isNaN(currentNumber)) {
        throw new Error('Invalid currentNumber');
      }

      const newPrediction = new Prediction({
        number: currentNumber,
        nextNumber: nextNumber,
        price: Math.floor(Math.random() * 965440),
        period: period,
        result: currentNumber, // Ensure result is assigned
      });

      await newPrediction.save();

      console.log("Current Number:", currentNumber);
      console.log("Next Predicted Number:", nextNumber);

      return currentNumber;
    } catch (error) {
      console.error("Error in generation:", error);
    } finally {
      isGenerating = false;
    }
  }
};


setInterval(() => {
  handleRandomNumberGeneration();
  countdownStartTime = Date.now(); // 🛠️ FIX: Reset countdown timer every 90s
}, 90000);

// API endpoint to get the countdown time
const getCountdownTimeEndpoint = asyncHandler(async (req, res) => {
  const elapsedTime = Math.floor((Date.now() - countdownStartTime) / 1000);
  const countdownTime = Math.max(90 - elapsedTime, 0);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { countdownTime },
        "Countdown time fetched successfully"
      )
    );
});

const deleteOldRandomNumbers = async () => {
  try {
    const lastNumbers = await Prediction.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .select("_id");

    const lastIds = lastNumbers.map((record) => record._id);

    await Prediction.deleteMany({
      _id: { $nin: lastIds },
    });

    console.log("Older records deleted, keeping last 100");
  } catch (error) {
    console.error("Deletion error:", error);
  }
};

// API endpoint to get the latest 40 random numbers
const getRandomNumberEndpoint = asyncHandler(async (req, res) => {
  const latestNumbers = await Prediction.find()
    .sort({ createdAt: -1 })
    .limit(100); // Fetch the latest 40 random numbers

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        latestNumbers,
        "Latest random numbers fetched successfully"
      )
    );
});

// API endpoint to get the last 40 random numbers
const getLastTenRandomNumbersEndpoint = asyncHandler(async (req, res) => {
  const lastTenNumbers = await Prediction.find()
    .sort({ createdAt: -1 }) // Sort by createdAt in descending order
    .limit(100); // Limit to the last 40 records

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        lastTenNumbers,
        "Last 100 random numbers fetched successfully"
      )
    );
});

// API endpoint to store UTR number
const storeUTRNumberEndpoint = asyncHandler(async (req, res) => {
  const { utrNumber, amount, userId, userDetails } = req.body;
  const { phone, status } = userDetails;
  console.log("Request Body:", req.body);

  // Validate required fields
  if (!utrNumber) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "UTR number is required"));
  }

  if (!amount) {
    return res
      .status(402)
      .json(new ApiResponse(402, null, "Amount is required"));
  }

  if (!userId) {
    return res.status(404).json(new ApiResponse(404, null, "Please login"));
  }

  try {
    // Create a new UTR number record
    const utrRecord = new UTRNumber({
      utrNumber,
      amount,
      userId,
      phone,
      status: status || "pending",
    });

    // Save the record to the database
    await utrRecord.save();

    return res
      .status(201)
      .json(new ApiResponse(201, utrRecord, "UTR number stored successfully"));
  } catch (error) {
    console.error("Error storing UTR number:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "An error occurred while storing the UTR number"
        )
      );
  }
});

// API endpoint to update user balance
const updateUserBalanceEndpoint = asyncHandler(async (req, res) => {
  const { userId, amount } = req.body;
  // console.log("Request Bodys:", req.body);

  // Validate required fields
  if (!userId || !amount) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "User ID and amount are required"));
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    // Update the user's balance
    user.balance += amount;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User balance updated successfully"));
  } catch (error) {
    console.error("Error updating user balance:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "An error occurred while updating the user balance"
        )
      );
  }
});

const getUserBalanceEndpoint = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Validate required fields
  if (!userId) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "User ID is required"));
  }

  // Validate MongoDB ID format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid User ID format"));
  }

  try {
    const user = await User.findById(userId).select("balance");

    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { balance: user.balance },
          "Balance fetched successfully"
        )
      );
  } catch (error) {
    console.error("DB Error:", error);

    // Handle specific MongoDB errors
    if (error instanceof mongoose.Error.CastError) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid user ID format"));
    }

    return res
      .status(500)
      .json(new ApiResponse(500, null, error.message || "Server error"));
  }
});

const deductUserBalance = async (userId, totalAmount) => {
  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Check if the user has sufficient balance
    if (user.balance < totalAmount) {
      return { success: false, message: "Insufficient balance" };
    }

    // Deduct the amount from the user's balance
    user.balance -= totalAmount;
    await user.save();

    return { success: true, user };
  } catch (error) {
    console.error("Error deducting user balance:", error);
    return {
      success: false,
      message: "An error occurred while deducting the user balance",
    };
  }
};

const handleUserBetEndpoint = asyncHandler(async (req, res) => {
  const { userId, totalAmount, betType, number } = req.body;

  console.log("req.body", req.body);
  
  // Enhanced validation
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json(
      new ApiResponse(400, null, "Invalid User ID format")
    );
  }

  if (typeof totalAmount !== 'number' || totalAmount <= 0) {
    return res.status(400).json(
      new ApiResponse(400, null, "Valid positive amount required")
    );
  }

  if (!['number', 'color'].includes(betType)) {
    return res.status(400).json(
      new ApiResponse(400, null, "Invalid bet type")
    );
  }

  if (betType === 'color') {
    const validColors = ['green', 'red', 'violet'];
    if (!validColors.includes(number)) {
      return res.status(400).json(
        new ApiResponse(400, null, "Invalid color selection")
      );
    }
  } else if (betType === 'number') {
    const numberValue = parseInt(number, 10);
    if (isNaN(numberValue) || numberValue < 0 || numberValue > 9) {
      return res.status(400).json(
        new ApiResponse(400, null, "Invalid number selection (0-9 only)")
      );
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Charge calculation and balance deduction
    const charge = Number((totalAmount * 0.02).toFixed(2));
    const totalDeduction = Number((totalAmount + charge).toFixed(2));

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json(
        new ApiResponse(404, null, "User not found")
      );
    }

    if (user.balance < totalDeduction) {
      await session.abortTransaction();
      return res.status(400).json(
        new ApiResponse(400, null, "Insufficient balance")
      );
    }

    user.balance = Number((user.balance - totalDeduction).toFixed(2));
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Wait for game result
    const currentTime = Date.now();
    const elapsed = Math.floor((currentTime - countdownStartTime) / 1000);
    const remainingTime = Math.max(90 - elapsed, 0);
    await new Promise(resolve => setTimeout(resolve, remainingTime * 1000));

    // Get result number
    const latestPrediction = await Prediction.findOne()
      .sort({ createdAt: -1 })
      .lean();
    const randomNumber = latestPrediction?.number;

    if (typeof randomNumber === 'undefined') {
      return res.status(500).json(
        new ApiResponse(500, null, "Result not available")
      );
    }

    // Calculate winnings
    let multiplier = 0;
    let result = "LOSS";

    if (betType === 'number') {
      const selectedNumber = parseInt(number, 10);
      if (selectedNumber === randomNumber) {
        multiplier = [0, 5].includes(selectedNumber) ? 4.5 : 9;
        result = "WIN";
      }
    } else if (betType === 'color') {
      switch(number) {
        case 'green':
          if ([1, 3, 5, 7, 9].includes(randomNumber)) {
            multiplier = randomNumber === 5 ? 1.5 : 2;
            result = "WIN";
          }
          break;
        case 'red':
          if ([0, 2, 4, 6, 8].includes(randomNumber)) {
            multiplier = randomNumber === 0 ? 1.5 : 2;
            result = "WIN";
          }
          break;
        case 'violet':
          if ([0, 5].includes(randomNumber)) {
            multiplier = 1.5;
            result = "WIN";
          }
          break;
      }
    }

    // Process winnings if any
    if (multiplier > 0) {
      const winSession = await mongoose.startSession();
      winSession.startTransaction();
      
      try {
        const winningUser = await User.findById(userId).session(winSession);
        const winnings = Number((totalAmount * multiplier).toFixed(2));
        winningUser.balance = Number((winningUser.balance + winnings).toFixed(2));
        await winningUser.save({ session: winSession });
        await winSession.commitTransaction();
      } catch (error) {
        await winSession.abortTransaction();
        throw error;
      } finally {
        winSession.endSession();
      }
    }

    // Save detailed bet history
    const betHistory = new BetHistory({
      userId,
      betType,
      betAmount: totalAmount,
      selectedNumber: betType === 'number' ? parseInt(number, 10) : null,
      selectedColor: betType === 'color' ? number : null,
      randomNumber,
      multiplier,
      result
    });
    await betHistory.save();

    return res.status(200).json(
      new ApiResponse(200, { 
        result: randomNumber,
        betType,
        selected: number,
        multiplier,
        status: result
      }, "Bet processed successfully")
    );

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Bet processing error:", error);
    return res.status(500).json(
      new ApiResponse(500, null, error.message || "Bet processing failed")
    );
  }
});

const getUserBetHistoryEndpoint = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Validate User ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json(
      new ApiResponse(400, null, "Invalid User ID format")
    );
  }

  try {
    const betHistory = await BetHistory.find({ userId }).sort({ createdAt: -1 });

    if (!betHistory.length) {
      return res.status(404).json(
        new ApiResponse(404, null, "No bet history found for this user")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, betHistory, "Bet history fetched successfully")
    );
  } catch (error) {
    console.error("Error fetching bet history:", error);
    return res.status(500).json(
      new ApiResponse(500, null, "An error occurred while fetching the bet history")
    );
  }
});

// Initialize Razorpay client
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
const RazorPayCreatePaymentOrder = asyncHandler(async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res
        .status(400)
        .json({ success: false, message: "Amount is required" });
    }

    const options = {
      amount: amount * 1, // Convert amount to paise
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
      payment_capture: 1,
    };

    const response = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: response.id,
      amount: response.amount,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
});

// Verify Payment and Update Balance
const RazorpayPaymentAndUpdateBalance = asyncHandler(async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, amount, userId } = req.body;

    // Create expected signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    // Validate signature
    if (expectedSignature !== razorpaySignature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // If signature is valid, update user balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Convert amount from paise to rupees
    const amountInRupees = amount / 1 ;

    // Update user balance
    user.balance += amountInRupees;
    await user.save();

    // Create transaction record
    const transaction = new Transaction({
      userId,
      amount: amountInRupees,
      type: "credit",
      paymentMethod: "Razorpay",
      status: "completed",
      transactionId: razorpayPaymentId,
    });
    await transaction.save();

    res.status(200).json({
      success: true,
      message: "Payment verified and balance updated",
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res
      .status(500)
      .json({ success: false, message: "Payment verification failed" });
  }
});

export {
  getCountdownTimeEndpoint,
  getRandomNumberEndpoint,
  getLastTenRandomNumbersEndpoint,
  deleteOldRandomNumbers,
  storeUTRNumberEndpoint,
  updateUserBalanceEndpoint,
  getUserBalanceEndpoint,
  deductUserBalance,
  handleUserBetEndpoint,
  getUserBetHistoryEndpoint,
  RazorPayCreatePaymentOrder,
  RazorpayPaymentAndUpdateBalance
};