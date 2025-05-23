
import { json } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { generate as shortid } from 'shortid';
import QRCode from 'qrcode';


// Admin override state
let adminOverride = {
    active: false,
    color: null,
    expiresAt: null

  };
  
  const PaymentSchema = new mongoose.Schema({
    paymentId: String,
    amount: Number,
    description: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    utr: String,
    transactionId: String,
    type: String,
    qrCode: String,
    bankName: String,
    accountNumber: String,
    ifscCode: String
});

export const Payment = mongoose.model('Payment', PaymentSchema);



const BANK_DETAILS = {
    name: "HDFC Bank",
    accountNumber: "245611010000202",
    ifsc: "UBIN0824569",
    upiId: "wavelina@uboi",

    // name: "HDFC Bank",
    // accountNumber: "8745579201",
    // ifsc: "KKBK0000883",
    // upiId: "bhavinkatariya@kotak"
};

const generateAccessToken = async (userId) => {
    return jwt.sign(
        { _id: userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" } // short-lived token
    );
};

const generateRefreshToken = async (userId) => {
    return jwt.sign(
        { _id: userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "24h" } // correct format
    );
};

const createPayment = asyncHandler(async (req, res) => {
    const { amount, description } = req.body;
    const userId = req.user._id;

    console.log("req.body",req.body);
    
    if (!amount || typeof amount !== 'number' || amount <= 0) {
        throw new ApiErrors(400, "Please Enter valid amount");
    }

    // उपयोगकर्ता को खोजें
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiErrors(404, "User not found");
    }

    // पेमेंट आईडी जनरेट करें
    const paymentId = shortid();
    const paymentLink = `${process.env.FRONTEND_URL || 'https://wavelina.store'}/pay/${paymentId}`;

    // UPI URL बनाएं
    const upiPaymentUrl = `upi://pay?pa=${BANK_DETAILS.upiId}&pn=${encodeURIComponent(BANK_DETAILS.name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(description || 'Payment')}`;

    // QR कोड जनरेट करें
    const qrCodeUrl = await QRCode.toDataURL(upiPaymentUrl);

    // पेमेंट रिकॉर्ड सेव करें
    const payment = new Payment({
        paymentId,
        amount,
        description: description || '',
        userId,
        type: "credit",
        transactionId: `AMT-${Date.now()}`,
        qrCode: qrCodeUrl,
        bankName: BANK_DETAILS.name,
        accountNumber: BANK_DETAILS.accountNumber,
        ifscCode: BANK_DETAILS.ifsc,
        status: 'pending' // स्टेटस को completed में बदलें
    });

    await payment.save();

    return res.status(201).json(
        new ApiResponse(200, {
            paymentId,
            paymentLink,
            amount,
             type: "credit",
            transactionId: `AMT-${Date.now()}` ,
            newWalletBalance: user.wallet, // अपडेटेड बैलेंस
            description: description || '',
            qrCode: qrCodeUrl,
            bankDetails: {
                name: BANK_DETAILS.name,
                accountNumber: BANK_DETAILS.accountNumber,
                ifsc: BANK_DETAILS.ifsc,
                upiId: BANK_DETAILS.upiId
            },

            status: 'pending'
        }, "Payment created successfully")
    );
});

const verifyPayment = asyncHandler(async (req, res) => {
    const { paymentId, utrNumber,  amount } = req.body;
    const userId = req.user._id;

    console.log("req.body verify",req.body);
    console.log("userId",userId);
    
    if (!paymentId || !utrNumber) {
        throw new ApiErrors(400, "Payment ID and UTR number are required");
    }

    // Check if UTR already exists in database
    const existingPaymentWithUTR = await Payment.findOne({ utr: utrNumber });
    if (existingPaymentWithUTR) {
        throw new ApiErrors(400, "UTR number already exists in our system");
    }


    const payment = await Payment.findOneAndUpdate(
        { paymentId, userId },
        { 
            utr: utrNumber, 
            status: 'completed', 
            type: "credit",
            transactionId: `AMT-${Date.now()}` ,
            completedAt: Date.now() 
        },
        { new: true }
    );

   
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiErrors(404, "User not found");
    }
    
    user.balance += amount;
    await user.save();


    if (!payment) {
        throw new ApiErrors(404, "Payment not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {
            id: payment.paymentId,
            amount: payment.amount,
            status: payment.status,
            utr: utrNumber,
            type: "credit",
            transactionId: `AMT-${Date.now()}` ,
            completedAt: payment.completedAt,
        }, "Payment verified successfully")
    );
});

const getPaymentDetails = asyncHandler(async (req, res) => {
    const paymentId = req.params.paymentId;
    const userId = req.user._id;

    const payment = await Payment.findOne({ paymentId, userId });
    
    if (!payment) {
        throw new ApiErrors(404, "Payment not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {
            id: payment.paymentId,
            amount: payment.amount,
            description: payment.description,
            status: payment.status,
            qrCode: payment.qrCode,
            bankDetails: {
                name: payment.bankName,
                accountNumber: payment.accountNumber,
                ifsc: payment.ifscCode,
                upiId: BANK_DETAILS.upiId
            },
            paymentLink: `${process.env.FRONTEND_URL || 'https://wavelina.store'}/pay/${payment.paymentId}`,
            createdAt: payment.createdAt,
            utr: payment.utr
        }, "Payment details fetched successfully")
    );
});

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, fullname, phoneNo, referralCode, balance  } = req.body;
    console.log("req.bod",req.body);
    // console.log("refid",referralCode);
  

    if ([username, email, password, fullname, phoneNo].some((field) => !field || field.trim() === "")) {
        throw new ApiErrors(409, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { phoneNo }],
    });

    if (existedUser) {
        throw new ApiErrors(410, "email Or phoneNo already exists");
    }

    let referredBy = null;
    if (referralCode) {
        const referrer = await User.findOne({ referralCode });
        if (!referrer) {    
            throw new ApiErrors(412, "Invalid referral code");
        }
        referredBy = referrer._id;
    }

    const user = await User.create({
        fullname,
        phoneNo,
        password,
        email,
        username: username.toLowerCase(),
        referredBy,
        balance,
    });

    

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiErrors(500, "Something went wrong while registering user");
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            user: createdUser,
            accessToken,
            refreshToken,
        }, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password, phoneNo } = req.body;

    if (!(email || username || phoneNo)) {
        throw new ApiErrors(400, "Please enter email and username");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }, { phoneNo }],
    });

    if (!user) {
        throw new ApiErrors(404, "User not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiErrors(401, "Password is wrong");
    }

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge:  24 * 60 * 60 * 1000 // 24 Hours
    };

    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            user: loggedInUser,
            accessToken,
            refreshToken,
        }, "User logged in successfully"));
});

const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res.status(201)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");

    if (!user) {
        throw new ApiErrors(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, user, "Current user fetched successfully"));
});



export {
    registerUser,
    loginUser,
    logOutUser,
    getCurrentUser,
    createPayment,
    verifyPayment,
    getPaymentDetails
  
};


// import { json } from "express";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { User } from "../models/user.models.js";
// import { ApiErrors } from "../utils/ApiErrors.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import jwt from "jsonwebtoken";
// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// // Admin override state
// let adminOverride = {
//   active: false,
//   color: null,
//   expiresAt: null
// };

// // Token generation functions
// const generateAccessToken = (userId) => {
//   return jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
// };

// const generateRefreshToken = (userId) => {
//   return jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
// };

// // Common response options
// const cookieOptions = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production"
// };

// // User Registration
// const registerUser = asyncHandler(async (req, res) => {
//   const { username, email, password, fullname, phoneNo, referralCode } = req.body;

//   if ([username, email, password, fullname, phoneNo].some((field) => !field?.trim())) {
//     throw new ApiErrors(400, "All fields are required");
//   }

//   const existedUser = await User.findOne({
//     $or: [{ email }, { phoneNo }, { username: username.toLowerCase() }]
//   });

//   if (existedUser) {
//     throw new ApiErrors(409, "User already exists");
//   }

//   let referredBy = null;
//   if (referralCode) {
//     const referrer = await User.findOne({ referralCode });
//     if (!referrer) {
//       throw new ApiErrors(400, "Invalid referral code");
//     }
//     referredBy = referrer._id;
//   }

//   const user = await User.create({
//     fullname,
//     phoneNo,
//     password,
//     email,
//     username: username.toLowerCase(),
//     referredBy,
//     balance: 0
//   });

//   const accessToken = generateAccessToken(user._id);
//   const refreshToken = generateRefreshToken(user._id);

//   const createdUser = await User.findById(user._id).select("-password -refreshToken");

//   return res
//     .status(201)
//     .cookie("accessToken", accessToken, cookieOptions)
//     .cookie("refreshToken", refreshToken, cookieOptions)
//     .json(new ApiResponse(201, { user: createdUser }, "User registered successfully"));
// });

// // Admin Registration
// const registerAdmin = asyncHandler(async (req, res) => {
//   const { username, password,fullname,email,phoneNo } = req.body;

//   console.log("Admin Registration:", username, password);
//   console.log("Admin Registration:", req.body);
  
//   if (username !== 'Bhavins' || password !== 'Bhavins@123') {
//     throw new ApiErrors(403, "Invalid admin credentials");
//   }

//   const adminUser = await User.create({
    
//     fullname,
//   phoneNo,
//     username,
//     email,
//     password,
//     role: 'admin'
//   });


//   res.status(201).json(
//     new ApiResponse(201, {
//       _id: adminUser._id,
//       username: adminUser.username,
//       role: adminUser.role
//     }, "Admin registered successfully")
//   );
// });

// // User Login
// const loginUser = asyncHandler(async (req, res) => {
//   const { identifier, password } = req.body;

//   if (!identifier?.trim() || !password?.trim()) {
//     throw new ApiErrors(400, "All fields are required");
//   }

//   const user = await User.findOne({
//     $or: [
//       { username: identifier.toLowerCase() },
//       { email: identifier },
//       { phoneNo: identifier }
//     ]
//   });

//   if (!user) {
//     throw new ApiErrors(404, "User does not exist");
//   }

//   const isPasswordValid = await user.isPasswordCorrect(password);
//   if (!isPasswordValid) {
//     throw new ApiErrors(401, "Invalid credentials");
//   }

//   const accessToken = generateAccessToken(user._id);
//   const refreshToken = generateRefreshToken(user._id);

//   user.refreshToken = refreshToken;
//   await user.save({ validateBeforeSave: false });

//   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

//   return res
//     .status(200)
//     .cookie("accessToken", accessToken, cookieOptions)
//     .cookie("refreshToken", refreshToken, cookieOptions)
//     .json(new ApiResponse(200, { user: loggedInUser }, "Login successful"));
// });

// // Admin Login
// const loginAdmin = asyncHandler(async (req, res) => {
//   const { username, password } = req.body;

//   const user = await User.findOne({ username });
//   if (!user || user.role !== 'admin') {
//     throw new ApiErrors(403, "Unauthorized access");
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     throw new ApiErrors(401, "Invalid credentials");
//   }

//   const accessToken = generateAccessToken(user._id);
//   const refreshToken = generateRefreshToken(user._id);

//   res.cookie('accessToken', accessToken, { 
//     ...cookieOptions,
//     maxAge: 15 * 60 * 1000 // 15 minutes
//   });

//   return res
//     .status(200)
//     .json(new ApiResponse(200, 
//       { accessToken, refreshToken, role: user.role }, 
//       "Admin login successful"
//     ));
// });

// // Set Next Color (Admin Only)
// const setNextColor = asyncHandler(async (req, res) => {
//   const { color } = req.body;
//   const validColors = ['red', 'green', 'violet'];

//   if (!validColors.includes(color)) {
//     throw new ApiErrors(400, "Invalid color selection");
//   }

//   adminOverride = {
//     active: true,
//     color,
//     expiresAt: Date.now() + 120000 // 2 minutes
//   };

//   return res
//     .status(200)
//     .json(new ApiResponse(200, null, `Next color set to ${color}`));
// });

// // Get Override Status
// const getOverrideStatus = asyncHandler(async (req, res) => {
//   return res
//     .status(200)
//     .json(new ApiResponse(200, adminOverride, "Override status fetched"));
// });

// // Logout
// const logOutUser = asyncHandler(async (req, res) => {
//   await User.findByIdAndUpdate(
//     req.user._id,
//     { $unset: { refreshToken: 1 } },
//     { new: true }
//   );

//   return res
//     .status(200)
//     .clearCookie("accessToken", cookieOptions)
//     .clearCookie("refreshToken", cookieOptions)
//     .json(new ApiResponse(200, {}, "Logout successful"));
// });

// // Current User
// const getCurrentUser = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id).select("-password -refreshToken");
//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }
//   return res
//     .status(200)
//     .json(new ApiResponse(200, user, "Current user fetched"));
// });

// export {
//   registerUser,
//   loginUser,
//   logOutUser,
//   getCurrentUser,
//   registerAdmin,
//   loginAdmin,
//   setNextColor,
//   getOverrideStatus
// };