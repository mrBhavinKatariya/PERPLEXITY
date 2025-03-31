// Prediction.controller.jsx   30-3-25:10:57


import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Prediction } from "../models/storeNumber.models.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { UTRNumber } from "../models/UTRNumber.models.js";
import { User } from "../models/user.models.js";
import { BetHistory } from "../models/History.models.js";
import { Transaction } from "../models/Transaction.models.js";
import mongoose from "mongoose";
import Razorpay from "razorpay"; 
import crypto from "crypto";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import { sendEmail } from "../utils/SendEmail.utils.js";
import { log } from "console";
import { ReferralEarning } from "../models/ReferralEarning.models.js";


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
  if (isGenerating) return;
  isGenerating = true;
  
  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      // Get latest prediction with lock
      const last = await Prediction.findOne()
        .sort({ period: -1 })
        .session(session)
        .select('period nextNumber')
        .lean();

      // Calculate new period number
      const newPeriod = last ? last.period + 1 : 1;

      // Generate numbers with fallback
      const currentNumber = last?.nextNumber ?? generateSecureRandomNumber();
      const nextNumber = generateSecureRandomNumber();

      // Create new prediction record
      await Prediction.create([{
        number: currentNumber,
        nextNumber,
        period: newPeriod,
        price: Math.floor(Math.random() * 965440),
        result: currentNumber,
        createdAt: new Date()
      }], { session });

      // Update countdown synchronously
      countdownStartTime = Date.now();
      
      console.log(`Generated Period ${newPeriod}:`);
      console.log(`Current: ${currentNumber}, Next: ${nextNumber}`);
    });
    
    await session.endSession();
  } catch (error) {
    console.error("Generation Error:", error);
    // Implement retry logic or alert here
  } finally {
    isGenerating = false;
  }
};

// Precise interval using recursive timeout
const scheduleGeneration = () => {
  const now = Date.now();
  const nextInterval = 120000 - (now - countdownStartTime) % 120000;
  
  setTimeout(async () => {
    await handleRandomNumberGeneration();
    scheduleGeneration();
  }, nextInterval);
};

// Start the cycle
scheduleGeneration();


let countdownCache = {
  time: 120,
  lastUpdated: Date.now()
};

setInterval(() => {
  countdownCache.time = Math.max(120 - Math.floor((Date.now() - countdownStartTime) / 1000), 0);
}, 1000);

setInterval(() => {
  handleRandomNumberGeneration();
  countdownStartTime = Date.now(); // 🛠️ FIX: Reset countdown timer every 90s
}, 120000);

// API endpoint to get the countdown time
const getCountdownTimeEndpoint = asyncHandler(async (req, res) => {
  const elapsed = Math.floor((Date.now() - countdownStartTime)/1000);
  const remaining = 120 - (elapsed % 120);
  return res.status(200).json(
    new ApiResponse(
      200,
      { countdownTime: remaining},
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

  console.log("Request Body:", req.body);
  

  // Input validation remains the same
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid User ID"));
  }

  const validColors = ['green', 'red', 'violet'];
  const isColor = validColors.includes(number);
  const isNumber = !isNaN(number) && number >= 0 && number <= 9;
  
  if (!isColor && !isNumber) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid selection"));
  }

  if (typeof totalAmount !== 'number' || totalAmount <= 0) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid amount"));
  }

  // Deduction transaction remains unchanged
  let deductionSession;
  try {
    deductionSession = await mongoose.startSession();
    deductionSession.startTransaction();

    const user = await User.findById(userId).session(deductionSession);
    if (user.balance < totalAmount) {
      await deductionSession.abortTransaction();
      return res.status(400).json(new ApiResponse(400, null, "Insufficient balance"));
    }

    user.balance = Number((user.balance - totalAmount).toFixed(2));
    await user.save({ session: deductionSession });
    await deductionSession.commitTransaction();
  } catch (error) {
    // Error handling remains same
  } finally {
    deductionSession?.endSession();
  }

  // Result processing
  try {
    const currentPrediction = await Prediction.findOne().sort({ createdAt: -1 }).lean();
    if (!currentPrediction) {
      throw new Error("No active prediction found");
    }

    const targetPeriod = currentPrediction.period + 1;
    const expectedResult = currentPrediction.nextNumber;

    const remainingTime = Math.max(120 - Math.floor((Date.now() - countdownStartTime) / 1000), 0);
  await new Promise(resolve => setTimeout(resolve, remainingTime * 1000));

  const resultPrediction = await Prediction.findOne({ period: targetPeriod }).lean();
  if (!resultPrediction) {
    throw new Error("Next period result not generated");
  }

  const randomNumber = resultPrediction.number;

  let multiplier = 0;
  let result = "LOSS";
  const contractMoney = Number((totalAmount * 0.98).toFixed(2));

  

    // Winning logic में निम्नलिखित बदलाव
if (typeof number === 'number') {
  if (randomNumber === number) {
    multiplier =  6; 
    result = "WIN";
  }
} else {
  switch(number) {
    case 'green':
      if ([1,3,7,9].includes(randomNumber)) multiplier = 2;
      break;
    case 'red':
      if ([2,4,6,8].includes(randomNumber)) multiplier = 2;
    
      break;
    case 'violet':
      if ([0,5].includes(randomNumber)) multiplier = 2;
      break;
  }
  if (multiplier > 0) result = "WIN";
}

    // Winning transaction remains same
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
        winnings: contractMoney * multiplier
      }, "Bet processed successfully")
    );

  } catch (error) {
    console.error("Processing failed:", error);
    return res.status(500).json(new ApiResponse(500, null, "Processing failed"));
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
// const RazorPayCreatePaymentOrder = asyncHandler(async (req, res) => {
//   try {
//     const { amount } = req.body;

//     if (!amount) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Amount is required" });
//     }

//     const options = {
//       amount: amount * 1, // Convert amount to paise
//       currency: "INR",
//       receipt: crypto.randomBytes(10).toString("hex"),
//       payment_capture: 1,
//     };

//     const response = await razorpay.orders.create(options);

//     res.status(200).json({
//       success: true,
//       orderId: response.id,
//       amount: response.amount,
//       keyId: process.env.RAZORPAY_KEY_ID,
//     });
//   } catch (error) {
//     console.error("Error creating Razorpay order:", error);
//     res.status(500).json({ success: false, message: "Failed to create order" });
//   }
// });

const RazorPayCreatePaymentOrder = asyncHandler(async (req, res) => {

  console.log("req.body",req.body);
  
  try {
    const { amount }  = req.body;
    
    if (!amount) {
      return res
        .status(400)
        .json({ success: false, message: "Amount is required" });
    }

     const user = await User.findById(req.user._id).select("-password -refreshToken");

    // Check authenticated user
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // Get current user details
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

   // RazorPayCreatePaymentOrder function में referral logic के अंदर

    // Create Razorpay order
   const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: crypto.randomBytes(10).toString("hex"),
    payment_capture: 1,
  };


  // const razorpayResponse = await razorpay.orders.create(options); 
  const response = await razorpay.orders.create(options);


if (currentUser.referredBy) {
  const referralAmount = amount * 0.1;
  
  // Referrer का बैलेंस अपडेट करें
  await User.findByIdAndUpdate(
    currentUser.referredBy,
    { $inc: { walletBalance: referralAmount } },
    { new: true }
  );


  // ReferralEarning रिकॉर्ड बनाएं
  await ReferralEarning.create({
    referrer: currentUser.referredBy,
    referredUser: currentUser._id,
    amount: referralAmount,
    orderId: response.id // Razorpay ऑर्डर ID
  });
}

   

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


// Get Referral Earnings
const getReferralEarnings = asyncHandler(async (req, res) => {
  try {
    // Authenticated user को पहचानें
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Referral कमाई का डेटा fetch करें
    const earnings = await ReferralEarning.find({ referrer: user._id })
      .populate('referredUser', 'name email')
      .sort({ createdAt: -1 });

    // टोटल कमाई कैलकुलेट करें
    const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);

    res.status(200).json({
      success: true,
      totalEarnings,
      earnings
    });
    
  } catch (error) {
    console.error("Error fetching referral earnings:", error);
    res.status(500).json({ success: false, message: "Failed to fetch earnings" });
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
    // user.walletBalance += amountInRupees; ------------------------------------view  comment u.balance----------active this
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
  console.log("req.body",req.body);
  
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

console.log("Does contacts exist?", razorpay.contacts ? "Yes" : "No");


const createContact = async (user) => {
  try {
    const contactData = {
      name: user.fullname,
      email: user.email,
      contact: user.phoneNo,
      type: "customer",
    };

    const response = await axios.post(
      "https://api.razorpay.com/v1/contacts",
      contactData,
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET,
        },
      }
    );

    return response.data.id; // Return Contact ID
  } catch (error) {
    console.error("Error creating contact:", error.response?.data || error.message);
    throw new Error("Failed to create contact");
  }
};

// Create Fund Account
const createFundAccount = async (req, res) => {
  try {
    const { userId, name, accountNumber, ifscCode, email, phone } = req.body;

    if (!userId || !name || !accountNumber || !ifscCode || !email || !phone) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    console.log("Creating contact in Razorpay...");

    // Create Razorpay Contact
    const contact = await razorpay.contacts.create({
      name,
      type: "customer",
      email,
      contact,
    });

    console.log("Contact created:", contact);

    console.log("Creating fund account in Razorpay...");

    // Create Fund Account
    const fundAccount = await razorpay.fundAccounts.create({
      contact_id: contact.id,
      account_type: "bank_account",
      bank_account: {
        name,
        account_number: accountNumber,
        ifsc: ifscCode,
      },
    });

    console.log("Fund account created:", fundAccount);

    // Save fund account ID to user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          bankAccounts: {
            fundAccountId: fundAccount.id,
            last4: accountNumber.slice(-4),
            bankName: "Bank Name", // Extract from IFSC if needed
          },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      fundAccountId: fundAccount.id,
    });
  } catch (error) {
    console.error("Fund account error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to add bank account" });
  }
};

// const createFundAccount = asyncHandler(async (req, res) => {
//   try {
//     const { userId, name, accountNumber, ifscCode } = req.body;

//     // console.log("Razorpay Instance:", razorpay);

//     // Create Razorpay Contact
//     const contact = await razorpay.customers.create({
//       name: name,
//       type: "customer",
//     });

//     console.log("Contact Created:", contact);

//     // Create Fund Account
//      // ✅ Correct fund_accounts.create API
//      const fundAccount = await razorpay.fund_accounts.create({
//       contact_id: contact.id,
//       account_type: "bank_account",
//       bank_account: {
//         name,
//         account_number: accountNumber,
//         ifsc: ifscCode,
//       },
//     });
    

//     console.log("Fund Account Created:", fundAccount);

//     // Save fund account ID to user profile
//     await User.findByIdAndUpdate(userId, {
//       $push: {
//         bankAccounts: {
//           fundAccountId: fundAccount.id,
//           last4: accountNumber.slice(-4),
//           bankName: "Bank Name",
//         },
//       },
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



// Add this new controller to get actual transactions


// const transactionHistory = asyncHandler(async (req, res) => {
//   try {
//     // Proper parameter destructuring
//     const { userid } = req.params;
    
//     console.log("userId",userid);
    
//     // Authorization check - fixed property name
//     if (req.user._id.toString() !== userid) {
//       return res.status(403).json({ 
//         success: false,
//         message: 'Unauthorized access'
//       });
//     }

//     // Validate user existence - fixed parameter usage
//     const user = await User.findById(userid);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     console.log("user",user);
    

//     // Get transaction count with proper query
//     const totalTransactions = await Transaction.countDocuments({
//       user: userid,  // Using destructured userId
//       status: { $in: ['completed', 'pending', 'failed'] }
//     });

//     console.log("transa",totalTransactions);
    

//     res.status(200).json({
//       success: true,
//       totalTransactions,
//       message: 'Transaction count retrieved successfully'
//     });

//   } catch (error) {
//     console.error('Transaction count error:', error);
    
//     // Improved error handling with mongoose check
//     const isMongooseError = error instanceof mongoose.Error;
//     const statusCode = isMongooseError && error.name === 'CastError' 
//       ? 400 
//       : 500;

//     const errorMessage = isMongooseError
//       ? 'Database error'
//       : 'Server error';

//     res.status(statusCode).json({
//       success: false,
//       message: errorMessage,
//       error: process.env.NODE_ENV === 'development' 
//         ? { message: error.message, stack: error.stack }
//         : undefined
//     });
//   }
// });



const transactionHistory = asyncHandler(async (req, res) => {
  try {
    const { userid } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Authorization check
    if (req.user._id.toString() !== userid) {
      return res.status(403).json({ 
        success: false,
        message: 'Unauthorized access'
      });
    }

    // Get transactions with pagination
    const transactions = await Transaction.find({ userId: userid })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Format response and remove transaction ID
    const formattedTransactions = transactions.map(transaction => {
      const date = new Date(transaction.createdAt);
      return {
        // Select only required fields
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description,
        date: `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
      };
    });

    // Get total count
    const totalCount = await Transaction.countDocuments({ userId: userid });

    res.status(200).json({
      success: true,
      transactions: formattedTransactions,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    });

  } catch (error) {
    console.error('Transaction list error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
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
  initiateWithdrawal,
  transactionHistory,
  getReferralEarnings,

};