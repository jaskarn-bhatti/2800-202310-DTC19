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

// Static Files
app.use('/public', express.static(__dirname + "/public"));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/icons', express.static(__dirname + 'public/icons'));

// Set up database connections
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.de6cakk.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true });
const usersDb = mongoose.connection;

// Connect to the database
var dbStore = new MongoDBStore({
    uri: `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.de6cakk.mongodb.net/?retryWrites=true&w=majority`,
    collection: 'sessions'
});

// Set the view engine to ejs
app.set('view engine', 'ejs');

//Setup session
app.use(session({
    secret: `${process.env.NODE_SESSION_SECRET}`,
    resave: false,
    saveUninitialized: false,
    store: dbStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    }
}));

// Root Route
app.get('/', (req, res) => {
    //If user, redirect to home, else redirect to login
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.redirect('/login');
    }
});

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


/* LOGIN CODE */

// Login Route
app.get('/login', (req, res) => {
    res.render('pages/login');
});

// Login Schema
const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

// Login Backend
app.post('/login', async(req, res) => {
    try {
        var username = req.body.username;
        var password = req.body.password;

        const { error } = loginSchema.validate({ username, password });
        if (error) {
            throw new Error(error.details[0].message);
        }

        User.db = usersDb;

        const user = await User.findOne({ username: username });

        if (!user) {
            throw new Error('Invalid username or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error('Invalid username or password');
        }

        req.session.user = { id: user._id, email: user.email, username: user.username, password: user.password };
        res.redirect('/home');

    } catch (error) {
        console.log(error);
        res.send('Error signing up: ${error.message}. <a href = "/signup">Try again</a>')
    }
});

/* SIGNUP CODE */

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

// Signup backend
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
        res.redirect('/signup-metrics');

    } catch (error) {
        console.log(error);
        res.send('Error signing up: $ { error.message }. < a href = "/signup" > Try again < /a>');
    }
});

// Signup - User Metrics Route
app.get('/signup-metrics', (req, res) => {
    res.render('pages/signup-metrics');
});

// Signup - User Metrics Schema
const signUpMetricsSchema = Joi.object({
    age: Joi.number().integer().positive().required(),
    currentWeight: Joi.number().positive().required(),
    currentHeight: Joi.number().positive().required(),
    activityLevel: Joi.string().valid('sedentary', 'lightly active', 'moderately active', 'very active').required(),
    dailyCalories: Joi.number().positive().required(),
    goalWeight: Joi.number().positive().required()
});


// Signup - User Metrics Backend
app.post('/signup-metrics', async(req, res) => {
    try {
        const userID = req.session.user.id;
        var age = req.body.age;
        var currentWeight = req.body.currentWeight;
        var currentHeight = req.body.currentHeight;
        var activityLevel = req.body.activityLevel;
        var dailyCalories = req.body.dailyCalories;
        var goalWeight = req.body.goalWeight;

        const { error } = signUpMetricsSchema.validate({ age, currentWeight, currentHeight, activityLevel, dailyCalories, goalWeight });
        if (error) {
            throw new Error(error.details[0].message);
        }

        User.db = usersDb;

        await User.findOneAndUpdate({ _id: userID }, {
            age: age,
            currentWeight: currentWeight,
            currentHeight: currentHeight,
            activityLevel: activityLevel,
            dailyCalories: dailyCalories,
            goalWeight: goalWeight
        });

        var id = req.session.user.id;
        var email = req.session.user.email;
        var username = req.session.user.username;
        var password = req.session.user.password;

        req.session.user = { id: id, email: email, username: username, password: password, age: age, currentWeight: currentWeight, currentHeight: currentHeight, activityLevel: activityLevel, dailyCalories: dailyCalories, goalWeight: goalWeight };

        res.redirect('/home');

    } catch (error) {
        console.log(error);
        res.send('Errors');
    }
});

// Home Route
app.get('/home', (req, res) => {
    const username = req.session.user.username;
    res.render('pages/home', { username });
});

// Profile Route
app.get('/profile', (req, res) => {
    const username = req.session.user.username;
    const email = req.session.user.email;
    const age = req.session.user.age;
    const currentHeight = req.session.user.currentHeight;
    const currentWeight = req.session.user.currentWeight;
    const goalWeight = req.session.user.goalWeight;

    console.log(req.session.user);

    res.render('pages/profile', { username, email, age, currentHeight, currentWeight, goalWeight });
});


// Settings Route
app.get('/settings', (req, res) => {
    const username = req.session.user.username;
    const email = req.session.user.email;
    res.render('pages/settings', { username, email });
});

// Password Update Route
app.post('/update-password', async(req, res) => {
    try {
        const user = req.session.user;
        const newPassword = req.body.password;

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password in the database
        await User.updateOne({ _id: user.id }, { password: hashedPassword });

        // Update the password in the session
        req.session.user.password = hashedPassword;

        res.redirect('/settings');
    } catch (error) {
        console.error(error);
        res.send(`Error updating password: ${error.message}. <a href="/settings">Try again</a>`);
    }
});

//Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// 404 Route
app.get('*', (req, res) => {
    res.status(404).send('404 - Page not found');
});

// Launch app to listen to specified port
app.listen(process.env.PORT || 3000, () => {
    console.log('server is running on port 3000');
});