import mongoose, { Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { BetHistory } from "./History.models.js";

const userSchema = new Schema({
    
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    email:{
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
    phoneNo:{
        type: Number,
        required: true,
    },
    password:{
        type:String,
        required: [true,"password is required.."]
    },
    balance:{
        type:Number,
        default:0,
    },
    betHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "BetHistory"
    }],

    refreshToken:{
        type:String
    }

},{timestamps: true})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)

}




userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)