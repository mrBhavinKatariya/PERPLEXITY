
import { json } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessToken = async (userId) => {
    return jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30d" });
};

const generateRefreshToken = async (userId) => {
    return jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
};

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, fullname, phoneNo } = req.body;

    if ([username, email, password, fullname, phoneNo].some((field) => !field || field.trim() === "")) {
        throw new ApiErrors(409, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }, { phoneNo }],
    });

    if (existedUser) {
        throw new ApiErrors(409, "Username already exists");
    }

    const user = await User.create({
        fullname,
        phoneNo,
        password,
        email,
        username: username.toLowerCase(),
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
};