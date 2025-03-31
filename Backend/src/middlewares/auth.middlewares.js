

import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";

export const verifyJWT = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    // console.log("authHeader:", authHeader);
    
    if (!authHeader) {
        return res.status(401).json({ error: "Authorization header is missing" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
    if (!token) {
        return res.status(401).json({ error: "Token is missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded; // Attach user info to the request object
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};



export const verifyJWTS = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log("token",token);
        if (!token) {
            throw new ApiErrors(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        // console.log("decotedToken",decodedToken);
        
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new ApiErrors(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiErrors(401, error?.message || "Invalid access token")
    }
    
})

export const verifyAdmin = asyncHandler(async (req, res, next) => {
    let token;
    
    // Extract token from cookies or headers
    if (req.cookies.accessToken) {
        token = req.cookies.accessToken;
    } else if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select('-password');
        
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: "Admin access required" });
        }

        req.user = user;
        next();
    } // verifyAdmin middleware में expiry को हैंडल करें
    catch (error) {
        console.error('JWT Error:', error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: "Token expired",
                expiredAt: error.expiredAt // Optional
            });
        }
        res.status(401).json({ 
            message: "Invalid token",
            error: error.message // Debugging के लिए
        });
    }