import mongoose, { Schema} from "mongoose";


const UTRNumberSchema = new mongoose.Schema({
  utrNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },


  phone:{
    type: Number,
    // required: true,
  },
 
//   status: {
//     type: String,
//     enum: ['pending', 'completed', 'failed'],
//     default: 'pending'
//   },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

UTRNumberSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export const UTRNumber = mongoose.model('UTRNumber', UTRNumberSchema);




