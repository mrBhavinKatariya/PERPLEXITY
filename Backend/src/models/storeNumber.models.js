import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
    },
    
    nextNumber:{
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    period: {
        type: Number,
        required: true,
    },
    result: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const Prediction = mongoose.model("Prediction", predictionSchema);

export { Prediction };