//Load modules
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Joi = require('joi');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/user.js');

// Load the MongoDB driver and connect to the database
var MongoDBStore = require('connect-mongodb-session')(session);

const port = process.env.PORT || 3000;

//Create express app
const app = express();


// Set up database connections
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.de6cakk.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true });
const usersDb = mongoose.connection;

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.de6cakk.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true });
const sessionsDb = mongoose.connection;

var dbStore = new MongoDBStore({
    mongooseConnection: sessionsDb
});

// Connect to the database
// var dbStore = new MongoDBStore({
//     uri: 'mongodb + srv: //${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.lletqsu.mongodb.net/comp2537?retryWrites=true&w=majority',
//     collection: 'sessions'
// });

// Set the view engine to ejs
app.set('view engine', 'ejs');

//Setup session
app.use(session({
    secret: `
        $ { process.env.NODE_SESSION_SECRET }
        `,
    resave: false,
    saveUninitialized: false,
    store: dbStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    }
}));

//Database connection
// const { error } = require('console');
// // const { MongoDBStore } = require('connect-mongodb-session');
// mongoose.connect('mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.de6cakk.mongodb.net/?retryWrites=true&w=majority')
//     .then(() => {
//         console.log('connected to MongoDB')
//     }).catch(() => {
//         console.log(error)
//     });

//Not done yet

// Root Route
app.get('/', (req, res) => {
    //If user, redirect to home

    //Else, redirect to login
    res.redirect('/login');
});

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Login Route
app.get('/login', (req, res) => {
    res.render('pages/login');
});

// Signup Route
app.get('/signup', (req, res) => {
    res.render('pages/signup');
});

// Signup Schema
const signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
});

app.post('/signup', async(req, res) => {
    //Store user 
    try {
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;

        const { error } = signUpSchema.validate({ email, username, password });
        if (error) {
            throw new Error(error.details[0].message);
        }

        User.db = usersDb;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email: email,
            username: username,
            password: hashedPassword,
        });

        await user.save();
        req.session.user = { id: user._id, email: user.email, username: user.username, password: user.password };
        res.redirect('/home');

    } catch (error) {
        console.log(error);
        res.send('Error signing up: $ { error.message }. < a href = "/signup" > Try again < /a>');
    }
});

// Home Route
app.get('/home', (req, res) => {
    res.render('pages/home');
});

// Launch app to listen to specified port
app.listen(process.env.PORT || 3000, () => {
    console.log('server is running on port 3000');
});