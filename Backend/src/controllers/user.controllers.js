
// import { json } from "express";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { User } from "../models/user.models.js";
// import { ApiErrors } from "../utils/ApiErrors.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import jwt from "jsonwebtoken";
// import mongoose from "mongoose";


// // Admin override state
// let adminOverride = {
//     active: false,
//     color: null,
//     expiresAt: null
//   };
  
// const generateAccessToken = async (userId) => {
//     return jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30d" });
// };

// const generateRefreshToken = async (userId) => {
//     return jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
// };



// const registerUser = asyncHandler(async (req, res) => {
//     const { username, email, password, fullname, phoneNo, referralCode   } = req.body;
//     // console.log("req.body",req.body);
//     // console.log("refid",referralCode);
  

//     if ([username, email, password, fullname, phoneNo].some((field) => !field || field.trim() === "")) {
//         throw new ApiErrors(409, "All fields are required");
//     }

//     const existedUser = await User.findOne({
//         $or: [{ email }, { phoneNo }],
//     });

//     if (existedUser) {
//         throw new ApiErrors(410, "email Or phoneNo already exists");
//     }

//     let referredBy = null;
//     if (referralCode) {
//         const referrer = await User.findOne({ referralCode });
//         if (!referrer) {    
//             throw new ApiErrors(412, "Invalid referral code");
//         }
//         referredBy = referrer._id;
//     }

//     const user = await User.create({
//         fullname,
//         phoneNo,
//         password,
//         email,
//         username: username.toLowerCase(),
//         referredBy,
//         balance,
//     });

    

//     const accessToken = await generateAccessToken(user._id);
//     const refreshToken = await generateRefreshToken(user._id);
//     user.refreshToken = refreshToken;
//     await user.save();

//     const createdUser = await User.findById(user._id).select("-password -refreshToken");

//     if (!createdUser) {
//         throw new ApiErrors(500, "Something went wrong while registering user");
//     }

//     const options = {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//     };

//     return res.status(201)
//         .cookie("accessToken", accessToken, options)
//         .cookie("refreshToken", refreshToken, options)
//         .json(new ApiResponse(200, {
//             user: createdUser,
//             accessToken,
//             refreshToken,
//         }, "User registered successfully"));
// });




// const loginUser = asyncHandler(async (req, res) => {
//     const { username, email, password, phoneNo } = req.body;

//     if (!(email || username || phoneNo)) {
//         throw new ApiErrors(400, "Please enter email and username");
//     }

//     const user = await User.findOne({
//         $or: [{ username }, { email }, { phoneNo }],
//     });

//     if (!user) {
//         throw new ApiErrors(404, "User not exist");
//     }

//     const isPasswordValid = await user.isPasswordCorrect(password);

//     if (!isPasswordValid) {
//         throw new ApiErrors(401, "Password is wrong");
//     }

//     const accessToken = await generateAccessToken(user._id);
//     const refreshToken = await generateRefreshToken(user._id);
//     user.refreshToken = refreshToken;
//     await user.save();

//     const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

//     const options = {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//     };

//     return res.status(201)
//         .cookie("accessToken", accessToken, options)
//         .cookie("refreshToken", refreshToken, options)
//         .json(new ApiResponse(200, {
//             user: loggedInUser,
//             accessToken,
//             refreshToken,
//         }, "User logged in successfully"));
// });

// const logOutUser = asyncHandler(async (req, res) => {
//     await User.findByIdAndUpdate(
//         req.user._id,
//         {
//             $set: {
//                 refreshToken: 1,
//             },
//         },
//         {
//             new: true,
//         }
//     );

//     const options = {
//         httpOnly: true,
//         secure: true,
//     };

//     return res.status(201)
//         .clearCookie("accessToken", options)
//         .clearCookie("refreshToken", options)
//         .json(new ApiResponse(200, {}, "User logged out"));
// });

// const getCurrentUser = asyncHandler(async (req, res) => {
//     const user = await User.findById(req.user._id).select("-password -refreshToken");

//     if (!user) {
//         throw new ApiErrors(404, "User not found");
//     }

//     return res.status(200).json(new ApiResponse(200, user, "Current user fetched successfully"));
// });



// export {
//     registerUser,
//     loginUser,
//     logOutUser,
//     getCurrentUser,
  
// };


import { json } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Admin override state
let adminOverride = {
  active: false,
  color: null,
  expiresAt: null
};

// Token generation functions
const generateAccessToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
};

// Common response options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production"
};

// User Registration
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, fullname, phoneNo, referralCode } = req.body;

  if ([username, email, password, fullname, phoneNo].some((field) => !field?.trim())) {
    throw new ApiErrors(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { phoneNo }, { username: username.toLowerCase() }]
  });

  if (existedUser) {
    throw new ApiErrors(409, "User already exists");
  }

  let referredBy = null;
  if (referralCode) {
    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      throw new ApiErrors(400, "Invalid referral code");
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
    balance: 0
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(201, { user: createdUser }, "User registered successfully"));
});

// Admin Registration
const registerAdmin = asyncHandler(async (req, res) => {
  const { username, password,fullname,email,phoneNo } = req.body;

  console.log("Admin Registration:", username, password);
  console.log("Admin Registration:", req.body);
  
  if (username !== 'Bhavins' || password !== 'Bhavins@123') {
    throw new ApiErrors(403, "Invalid admin credentials");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const adminUser = await User.create({
    
    fullname,
  phoneNo,
    username,
    email,
    password: hashedPassword,
    role: 'admin'
  });


  res.status(201).json(
    new ApiResponse(201, {
      _id: adminUser._id,
      username: adminUser.username,
      role: adminUser.role
    }, "Admin registered successfully")
  );
});

// User Login
const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier?.trim() || !password?.trim()) {
    throw new ApiErrors(400, "All fields are required");
  }

  const user = await User.findOne({
    $or: [
      { username: identifier.toLowerCase() },
      { email: identifier },
      { phoneNo: identifier }
    ]
  });

  if (!user) {
    throw new ApiErrors(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiErrors(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user: loggedInUser }, "Login successful"));
});

// Admin Login
const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || user.role !== 'admin') {
    throw new ApiErrors(403, "Unauthorized access");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiErrors(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.cookie('accessToken', accessToken, { 
    ...cookieOptions,
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  return res
    .status(200)
    .json(new ApiResponse(200, 
      { accessToken, refreshToken, role: user.role }, 
      "Admin login successful"
    ));
});

// Set Next Color (Admin Only)
const setNextColor = asyncHandler(async (req, res) => {
  const { color } = req.body;
  const validColors = ['red', 'green', 'violet'];

  if (!validColors.includes(color)) {
    throw new ApiErrors(400, "Invalid color selection");
  }

  adminOverride = {
    active: true,
    color,
    expiresAt: Date.now() + 120000 // 2 minutes
  };

  return res
    .status(200)
    .json(new ApiResponse(200, null, `Next color set to ${color}`));
});

// Get Override Status
const getOverrideStatus = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, adminOverride, "Override status fetched"));
});

// Logout
const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logout successful"));
});

// Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Current user fetched"));
});

export {
  registerUser,
  loginUser,
  logOutUser,
  getCurrentUser,
  registerAdmin,
  loginAdmin,
  setNextColor,
  getOverrideStatus
};