const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    email: String,
    username: String,
    password: String,
}, {
    collection: 'users'
});


const usersModel = mongoose.model('User', usersSchema);

module.exports = usersModel;