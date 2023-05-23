const mongoose = require('mongoose');

const userLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  date: {
    type: Date,
    default: Date.now
  },
  exerciseTime: Number,
  exerciseType: String,
  stepsTaken: Number,
  caloriesBurned: Number
});

const UserLog = mongoose.model('UserLog', userLogSchema);

module.exports = UserLog;