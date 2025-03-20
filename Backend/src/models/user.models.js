// import mongoose, { Schema} from "mongoose";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt"
// import { BetHistory } from "./History.models.js";

// const userSchema = new Schema({
    
//     username:{
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//         lowercase: true,
//         index: true
//     },
//     email:{
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//         lowercase: true
//     },
//      fullname: {
//         type: String,
//         required: true,
//         trim: true,
//         index: true
//     },
//     phoneNo:{
//         type: Number,
//         required: true,
//     },
//     password:{
//         type:String,
//         required: [true,"password is required.."]
//     },
//     balance:{
//         type:Number,
//         default:0,
//     },
//     betHistory: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "BetHistory"
//     }],

//     passwordResetToken:{
//         type: String,
//     },
//     refreshToken:{
//         type:String
//     }

// },{timestamps: true})

// // Password reset token methods
// userSchema.methods.createPasswordResetToken = function() {
//     const resetToken = crypto.randomBytes(32).toString('hex');
  
//     this.passwordResetToken = crypto
//       .createHash('sha256')
//       .update(resetToken)
//       .digest('hex');
  
//     this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
//     return resetToken;
//   };

  
// userSchema.pre("save", async function (next) {
//     if(!this.isModified("password")) return next()

//     this.password = await bcrypt.hash(this.password, 10)
//     next()
// })

// userSchema.methods.isPasswordCorrect = async function (password) {
//     return await bcrypt.compare(password, this.password)

// }




// userSchema.methods.generateAccessToken = async function () {
//     return jwt.sign(
//         {
//             _id:this._id
//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         {
//             expiresIn: process.env.ACCESS_TOKEN_EXPIRY
//         }
//     )
// }


// userSchema.methods.generateRefreshToken = async function () {
//     return jwt.sign(
//         {
//             _id : this._id
//         },
//         process.env.REFRESH_TOKEN_SECRET,
//         {
//             expiresIn:process.env.REFRESH_TOKEN_EXPIRY
//         }
//     )
// }


// export const User = mongoose.model("User", userSchema)


import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto"; // Added missing crypto import
import { BetHistory } from "./History.models.js";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    phoneNo: {
        type: String, // Changed from Number to String to preserve formatting
        required: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    balance: {
        type: Number,
        default: 0,
    },
    betHistory: [{
        type: Schema.Types.ObjectId,
        ref: "BetHistory"
    }],
    passwordResetToken:{
        type:String,
    },

    passwordResetExpires:{
        type: Date,
     }, // Added missing field


    refreshToken:{
        type: String
    },
}, { timestamps: true });

// Password reset token methods
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes
  
    return resetToken;
  };


// userSchema.pre("save", async function(next) {
//     if (!this.isModified("password")) return next();
    
//     this.password = await bcrypt.hash(this.password, 10)
//     next()
// });

// userSchema.methods.isPasswordCorrect = async function(password) {
//     return await bcrypt.compare(password, this.password);
// };

// Removed async from token generators (JWT is synchronous)
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m"
        }
    );
};

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d"
        }
    );
};

export const User = mongoose.model("User", userSchema);