import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Prediction } from "../models/storeNumber.models.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { UTRNumber } from "../models/UTRNumber.models.js";
import { User } from "../models/user.models.js";
import { BetHistory } from "../models/History.models.js";
import { Transaction } from "../models/Transaction.models.js";
import mongoose from "mongoose";
import Razorpay from "razorpay"; // Import Razorpay
import crypto from "crypto";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import { sendEmail } from "../utils/SendEmail.utils.js";



dotenv.config()
let isGenerating = false;
let countdownStartTime = Date.now();

const generateRefreshToken = async (userId) => {
    return jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
};

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
      // console.log("Last Record:", lastRecord);

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
  const { userId, totalAmount, number } = req.body;

  console.log("req.bod",req.body);
  
  // Initial validation
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json(
      new ApiResponse(400, null, "Invalid User ID format")
    );
  }

  // Input type validation
  const validColors = ['green', 'red', 'violet'];
  const isColor = validColors.includes(number);
  const isNumber = !isNaN(number) && number >= 0 && number <= 9;
  
  if (!isColor && !isNumber) {
    return res.status(400).json(
      new ApiResponse(400, null, "Invalid selection")
    );
  }

  // Validate amount
  if (typeof totalAmount !== 'number' || totalAmount <= 0) {
    return res.status(400).json(
      new ApiResponse(400, null, "Invalid amount")
    );
  }

  // Deduction transaction
  let deductionSession;
  try {
    deductionSession = await mongoose.startSession();
    deductionSession.startTransaction();

    // Deduct balance
    const user = await User.findById(userId).session(deductionSession);
    if (user.balance < totalAmount) {
      await deductionSession.abortTransaction();
      deductionSession.endSession();
      return res.status(400).json(
        new ApiResponse(400, null, "Insufficient balance")
      );
    }

    user.balance = Number((user.balance - totalAmount).toFixed(2));
    await user.save({ session: deductionSession });
    
    await deductionSession.commitTransaction();
  } catch (error) {
    if (deductionSession?.inTransaction()) {
      await deductionSession.abortTransaction();
    }
    deductionSession?.endSession();
    console.error("Deduction failed:", error);
    return res.status(500).json(
      new ApiResponse(500, null, "Transaction failed")
    );
  } finally {
    deductionSession?.endSession();
  }

  // Result processing (separate from deduction transaction)
  try {
    // Wait for game result
    const remainingTime = Math.max(90 - Math.floor((Date.now() - countdownStartTime) / 1000), 0);
    await new Promise(resolve => setTimeout(resolve, remainingTime * 1000));

    // Get result
    const latestPrediction = await Prediction.findOne().sort({ createdAt: -1 }).lean();
    const randomNumber = latestPrediction?.number;

    // Calculate winnings
    let multiplier = 0;
    let result = "LOSS";
    const contractMoney = Number((totalAmount * 0.98).toFixed(2));
    let winnings = 0;

    // Winning calculation logic
    if (typeof number === 'number') {
      if (randomNumber === number) {
        multiplier = [0, 5].includes(number) ? 4.5 : 9;
        result = "WIN";
      }
    } else {
      switch(number) {
        case 'green':
          if ([1, 3, 7, 9].includes(randomNumber)) multiplier = 2;
          else if (randomNumber === 5) multiplier = 1.5;
          break;
        case 'red':
          if ([2, 4, 6, 8].includes(randomNumber)) multiplier = 2;
          else if (randomNumber === 0) multiplier = 1.5;
          break;
        case 'violet':
          if ([0, 5].includes(randomNumber)) multiplier = 1.5;
          break;
      }
      if (multiplier > 0) result = "WIN";
    }

    // Process winnings in separate transaction
    if (result === "WIN") {
      const winSession = await mongoose.startSession();
      try {
        winSession.startTransaction();
        const winningUser = await User.findById(userId).session(winSession);
        const winnings = Number((contractMoney * multiplier).toFixed(2));
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

    // Save bet history
    const betHistory = new BetHistory({
      userId,
      selectedColor: typeof number === 'number' ? 'number' : 'color',
      selection: number,
      betAmount: totalAmount,
      contractMoney,
      randomNumber,
      multiplier,
      result,
      winnings: multiplier > 0 ? Number((contractMoney * multiplier).toFixed(2)) : 0
    });
    await betHistory.save();

    return res.status(200).json(
      new ApiResponse(200, {
        result: randomNumber,
        multiplier,
        status: result,
        contractMoney,
        winnings: (contractMoney * multiplier)
      }, "Bet processed successfully")
    );

  } catch (error) {
    console.error("Result processing failed:", error);
    return res.status(500).json(
      new ApiResponse(500, null, "Result processing failed")
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

// Initiate Withdrawal Request
const initiateWithdrawal = asyncHandler(async (req, res) => {
  try {
    const { userId, amount, fundAccountId } = req.body;

    // Validate input
    if (!userId || !amount || !fundAccountId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user and check balance
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct balance immediately
    user.balance -= amount;
    await user.save();

    // Create transaction record
    const transaction = new Transaction({
      userId,
      amount,
      type: "withdrawal",
      paymentMethod: "Razorpay Payout",
      status: "processing",
    });
    await transaction.save();

    // Create Razorpay payout
    const payoutOptions = {
      account_number: process.env.RAZORPAY_KEY_ID, // Merchant's account
      fund_account_id: fundAccountId,
      amount: amount * 100, // Convert to paise
      currency: "INR",
      mode: "IMPS",
      purpose: "payout",
      reference_id: `WITHDRAWAL_${transaction._id}`,
    };

    const payout = await razorpay.payouts.create(payoutOptions);

    // Update transaction with payout ID
    transaction.transactionId = payout.id;
    await transaction.save();

    res.status(200).json({
      success: true,
      message: "Withdrawal initiated",
      payoutId: payout.id,
    });

  } catch (error) {
    console.error("Withdrawal error:", error);
    
    // Revert balance deduction on error
    if (user) {
      user.balance += amount;
      await user.save();
    }
    
    res.status(500).json({ success: false, message: "Withdrawal failed" });
  }
});


// Razorpay Webhook Handler
const handlePayoutWebhook = asyncHandler(async (req, res) => {
  const body = req.body;
  const signature = req.headers['x-razorpay-signature'];

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(JSON.stringify(body))
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(400).json({ status: 'error', message: 'Invalid signature' });
  }

  const event = body.event;
  const payoutId = body.payload.payout.entity.id;

  try {
    // Find associated transaction
    const transaction = await Transaction.findOne({ transactionId: payoutId });
    if (!transaction) {
      return res.status(404).json({ status: 'error', message: 'Transaction not found' });
    }

    // Handle payout success
    if (event === 'payout.processed') {
      transaction.status = 'completed';
      await transaction.save();
    }
    // Handle payout failure
    else if (event === 'payout.failed') {
      transaction.status = 'failed';
      await transaction.save();

      // Refund user balance
      const user = await User.findById(transaction.userId);
      if (user) {
        user.balance += transaction.amount;
        await user.save();
      }
    }

    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});



// Create Fund Account
// const createFundAccount = asyncHandler(async (req, res) => {
//   try {
//     const { userId, name, accountNumber, ifscCode,  } = req.body;

//     console.log("userId",userId);
//     console.log("name",name);
//     console.log("accountNumber",accountNumber);
//     console.log("ifscCode",ifscCode);
  

//     // console.log("req.body",req.body);
    

//     // console.log("Razorpay",razorpay)
//     console.log("process.env.RAZORPAY_KEY_ID",process.env.RAZORPAY_KEY_ID);
//     console.log("process.env.RAZORPAY_KEY_SECRET",process.env.RAZORPAY_KEY_SECRET);



//     // console.log("Contact ID:", contact.id); // ✅ चेक करें कि ID मिल रहा है

//     // Create Razorpay Contact
//     const contact = await razorpay.contacts.create({
//       name: name,
//       type: "customer",
//     });

//     console.log("COntact created", contact);
        
    
//     // Create Fund Account
//     const fundAccount = await razorpay.fundAccount.create({
//       contact_id: contact.id,
//       account_type: "bank_account",
//       bank_account: {
//         name,
//         account_number: accountNumber,
//         ifsc: ifscCode,
//       },
//     });

//     // Save fund account ID to user profile
//     await User.findByIdAndUpdate(userId, {
//       $push: {
//         bankAccounts: {
//           fundAccountId: fundAccount.id,
//           last4: accountNumber.slice(-4),
//           bankName: "Bank Name" // Extract from IFSC if needed
//         }
//       }
//     });

//     res.status(200).json({
//       success: true,
//       fundAccountId: fundAccount.id,
//     });
//   } catch (error) {
//     console.error("Fund account error:", error);
//     res.status(500).json({ success: false, message: "Failed to add bank account" });
//   }
// });



const createFundAccount = asyncHandler(async (req, res) => {
  try {
    const { userId, name, accountNumber, ifscCode } = req.body;

    console.log("Razorpay Instance:", razorpay);

    // Create Razorpay Contact
    const contact = await razorpay.customers.create({
      name: name,
      contact: "9876543210", // Required field
      email: "test@example.com", // Required field
      type: "customer",
    });

    console.log("Contact Created:", contact);

    // Create Fund Account
    const fundAccount = await razorpay.fund_accounts.create({
      contact_id: contact.id,
      account_type: "bank_account",
      bank_account: {
        name,
        account_number: accountNumber,
        ifsc: ifscCode,
      },
    });

    console.log("Fund Account Created:", fundAccount);

    // Save fund account ID to user profile
    await User.findByIdAndUpdate(userId, {
      $push: {
        bankAccounts: {
          fundAccountId: fundAccount.id,
          last4: accountNumber.slice(-4),
          bankName: "Bank Name",
        },
      },
    });

    res.status(200).json({
      success: true,
      fundAccountId: fundAccount.id,
    });
  } catch (error) {
    console.error("Fund account error:", error);
    res.status(500).json({ success: false, message: "Failed to add bank account" });
  }
});


const changeCurrentPassword = asyncHandler(async(req, res) => {
  const {oldPassword, newPassword} = req.body

  console.log("oldpass",oldPassword);
  console.log("newpas",newPassword);

  
  // console.log("req.body",req.body);
  

  const user = await User.findById(req.user?._id)

  console.log("user", user);
  
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if (!isPasswordCorrect) {
      throw new ApiErrors(400, "Invalid old password")
  }

  user.password = newPassword
  await user.save({validateBeforeSave: false})

  return res
  .status(200)
  .json(new ApiResponse(200, {}, "Password changed successfully"))
})




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
  RazorpayPaymentAndUpdateBalance,
  changeCurrentPassword,
  createFundAccount,
  handlePayoutWebhook,
  initiateWithdrawal

};