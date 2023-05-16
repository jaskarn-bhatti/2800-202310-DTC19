const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
    age: Number,
    currentWeight: Number,
    currentHeight: Number,
    activityLevel: String,
    dailyCalories: Number,
    goalWeight: Number,
}, {
    collection: 'users'
});


const usersModel = mongoose.model('User', usersSchema);

module.exports = usersModel;