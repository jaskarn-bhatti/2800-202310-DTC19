//Load modules
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Joi = require('joi');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/user.js');
const UserLog = require('./models/userLog.js');

// Load the MongoDB driver and connect to the database
var MongoDBStore = require('connect-mongodb-session')(session);

// Define the port to run on
const port = process.env.PORT || 3000;

//Create express app
const app = express();

// Static Files
app.use('/public', express.static(__dirname + "/public"));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/icons', express.static(__dirname + 'public/icons'));
app.use('/scripts', express.static(__dirname + 'public/scripts'));

// Set up database connection
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.de6cakk.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true });
const usersDb = mongoose.connection;

// Define the MongoDB store
var dbStore = new MongoDBStore({
    uri: `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.de6cakk.mongodb.net/?retryWrites=true&w=majority`,
    collection: 'sessions'
});

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Set up session
app.use(session({
    secret: `${process.env.NODE_SESSION_SECRET}`,
    resave: false,
    saveUninitialized: false,
    store: dbStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    }
}));

// Middleware function to check if the user is logged in
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login');
        return;
    } else {
        next();
    }
};

// Root Route
app.get('/', (req, res) => {
    //If user, redirect to home, else redirect to login
    if (req.session.user) {
        res.redirect('/home');
    } else {
        res.redirect('/login');
    }
});

// Enable the use of request body parsing middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Error Page 
app.use((err, req, res, next) => {
    const errorMessage = err.message || 'An error occurred';
    res.redirect(`pages/error?message=${encodeURIComponent(errorMessage)}`);
});

app.get('/error', (req, res) => {
    const errorMessage = req.query.message || 'An error occurred';
    res.render('pages/error', { message: errorMessage });
});

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
        var username = req.body.username.trim();
        var password = req.body.password.trim();

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

        req.session.user = {
            id: user._id,
            email: user.email,
            username: user.username,
            password: user.password,
            age: user.age,
            currentHeight: user.currentHeight,
            currentWeight: user.currentWeight,
            goalWeight: user.goalWeight
        };

        res.redirect('/home');

    } catch (error) {
        console.log(error);
        res.redirect(`error?message=${encodeURIComponent(error.message)}`);
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
        var email = req.body.email.trim();
        var username = req.body.username.trim();
        var password = req.body.password.trim();

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
        res.redirect(`error?message=${encodeURIComponent(error.message)}`);
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
    activityLevel: Joi.string().valid('sedentary', 'lightlyActive', 'moderatelyActive', 'veryActive').required(),
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

        // Find user with the same id and update their metrics
        await User.findOneAndUpdate({ _id: userID }, {
            age: age,
            currentWeight: currentWeight,
            currentHeight: currentHeight,
            activityLevel: activityLevel,
            dailyCalories: dailyCalories,
            goalWeight: goalWeight
        });

        // Set the session user metrics
        var id = req.session.user.id;
        var email = req.session.user.email;
        var username = req.session.user.username;
        var password = req.session.user.password;

        req.session.user = { id: id, email: email, username: username, password: password, age: age, currentWeight: currentWeight, currentHeight: currentHeight, activityLevel: activityLevel, dailyCalories: dailyCalories, goalWeight: goalWeight };

        res.redirect('/home');

    } catch (error) {
        console.log(error);
        res.redirect(`error?message=${encodeURIComponent(error.message)}`);
    }
});

// Home Route
app.get('/home', requireLogin, async(req, res) => {
    try {
        const username = req.session.user.username;
        const exerciseSaved = req.session.exerciseSaved;

        // Clear the exerciseSaved flag in the session
        req.session.exerciseSaved = false;

        const userId = req.session.user.id;

        const userLogs = await UserLog.find({ userId });

        let totalStepsTaken = 0;
        let totalExerciseTime = 0;

        const currentTime = new Date(); // Get the current time

        // Calculate the total steps taken and total exercise time, considering logs within the last 24 hours
        for (const userLog of userLogs) {
            if (currentTime - userLog.date <= 24 * 60 * 60 * 1000) {
                // Check if the user log is within the last 24 hours
                totalStepsTaken += userLog.stepsTaken;
                totalExerciseTime += userLog.exerciseTime;
            }
        }

        const maxSteps = 20000;
        const maxExerciseTime = 1800; // Assuming the maximum exercise time is 1800 seconds (30 minutes)

        const stepsPercentage = (totalStepsTaken / maxSteps) * 100;
        const exerciseTimePercentage = (totalExerciseTime / maxExerciseTime) * 100;

        res.render('pages/home', { username, exerciseSaved, stepsTaken: totalStepsTaken, stepsPercentage, totalExerciseTime, exerciseTimePercentage });
    } catch (error) {
        console.error(error);
        res.redirect(`error?message=${encodeURIComponent(error.message)}`);
    }
});

// Run Page Route
app.get('/run', requireLogin, (req, res) => {
    res.render('pages/run');
});

// Complete Exercise Route
app.get('/complete-exercise', requireLogin, (req, res) => {
    const totalTime = req.session.totalTime;
    const userAge = req.session.user.age;
    const userWeight = req.session.user.currentWeight;
    const userHeight = req.session.user.currentHeight;
    const userActivityLevel = req.session.user.activityLevel;

    res.render('pages/complete-exercise', {
        totalTime,
        user: {
            age: userAge,
            weight: userWeight,
            height: userHeight,
            activityLevel: userActivityLevel
        }
    });
});;

// Complete Exercise Backend
app.post('/store-time', async(req, res) => {
    try {
        const userId = req.session.user.id;
        const totalTime = req.body.totalTime;
        const stepsTaken = req.body.stepsTaken;
        const exerciseType = req.body.exerciseType;
        const caloriesBurned = req.body.caloriesBurned;

        // Create a new UserLogEntry with the associated userId
        const userLog = new UserLog({
            userId: userId,
            exerciseTime: totalTime,
            stepsTaken: stepsTaken,
            exerciseType: exerciseType,
            caloriesBurned: caloriesBurned
        });

        // Save the UserLogEntry to the database
        await userLog.save();

        // Fetch the user from the database
        const user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        // Associate the UserLogEntry with the user
        user.userLog.push(userLog);
        await user.save();

        // Set a flag in the session to indicate that exercise is saved
        req.session.exerciseSaved = true;

        res.redirect('/home');
    } catch (error) {
        console.log(error);
        res.redirect(`error?message=${encodeURIComponent(error.message)}`);
    }
});

// Progress Route
app.get('/progress', requireLogin, async(req, res) => {
    try {
        const userId = req.session.user.id;
        const selectedLogId = req.query.datetime;

        // Retrieve the user's logs from the UserLog collection
        const userLogs = await UserLog.find({ userId });

        let selectedLog;
        if (selectedLogId) {
            selectedLog = await UserLog.findById(selectedLogId);
        }

        res.render('pages/progress', { userLogs, selectedLog });
    } catch (error) {
        console.log(error);
        res.redirect(`error?message=${encodeURIComponent(error.message)}`);
    }
});

// Easter Egg Route
app.get('/easter-egg', requireLogin, (req, res) => {
    res.render('pages/easter-egg');
});

// Profile Route
app.get('/profile', requireLogin, (req, res) => {
    const username = req.session.user.username;
    const email = req.session.user.email;
    const age = req.session.user.age;
    const currentHeight = req.session.user.currentHeight;
    const currentWeight = req.session.user.currentWeight;
    const goalWeight = req.session.user.goalWeight;

    console.log(username);
    console.log(req.session.user);

    res.render('pages/profile', { username, email, age, currentHeight, currentWeight, goalWeight });
});

// Settings Route
app.get('/settings', requireLogin, (req, res) => {
    const username = req.session.user.username;
    const email = req.session.user.email;
    const age = req.session.user.age;
    const currentHeight = req.session.user.currentHeight;
    const currentWeight = req.session.user.currentWeight;
    const goalWeight = req.session.user.goalWeight;

    res.render('pages/settings', { username, email, age, currentHeight, currentWeight, goalWeight });
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
        console.log(error);
        res.redirect(`error?message=${encodeURIComponent(error.message)}`);
    }
});

// Goal Weight Update Route
app.post('/update-goalWeight', async(req, res) => {
    try {
        const user = req.session.user;
        const newGoalWeight = req.body.goalWeight;

        // Validate the new goal weight
        if (Number(newGoalWeight) < 0) {
            throw new Error('Invalid goal weight. Please enter a positive number.');
        }

        // Update the user's goal weight in the database
        await User.updateOne({ _id: user.id }, { goalWeight: newGoalWeight });

        // Update the goal weight in the session
        req.session.user.goalWeight = newGoalWeight;

        res.redirect('/settings');
    } catch (error) {
        console.log(error);
        res.redirect(`/error?message=${encodeURIComponent(error.message)}`);
    }
});

// current Weight Update Route
app.post('/update-currentWeight', async(req, res) => {
    try {
        const user = req.session.user;
        const newCurrentWeight = req.body.currentWeight;

        // Validate the new goal weight
        if (Number(newCurrentWeight) < 0) {
            throw new Error('Invalid new weight. Please enter a positive number.');
        }

        // Update the user's goal weight in the database
        await User.updateOne({ _id: user.id }, { currentWeight: newCurrentWeight });

        // Update the goal weight in the session
        req.session.user.currentWeight = newCurrentWeight;

        res.redirect('/settings');
    } catch (error) {
        console.log(error);
        res.redirect(`error?message=${encodeURIComponent(error.message)}`);
    }
});

// current Height Update Route
app.post('/update-currentHeight', async(req, res) => {
    try {
        const user = req.session.user;
        const newCurrentHeight = req.body.currentHeight;

        // Validate the new goal weight
        if (Number(newCurrentHeight) < 0) {
            throw new Error('Invalid current height. Please enter a positive number.');
        }

        // Update the user's goal weight in the database
        await User.updateOne({ _id: user.id }, { currentHeight: newCurrentHeight });

        // Update the goal weight in the session
        req.session.user.currentHeight = newCurrentHeight;

        res.redirect('/settings');
    } catch (error) {
        console.log(error);
        res.redirect(`error?message=${encodeURIComponent(error.message)}`);
    }
});

// Age Update Route
app.post('/update-age', async(req, res) => {
    try {
        const user = req.session.user;
        const newAge = req.body.age;

        // Validate the new goal weight
        if (Number(newAge) < 0) {
            throw new Error('Invalid age. Please enter a positive number.');
        }

        // Update the user's goal weight in the database
        await User.updateOne({ _id: user.id }, { age: newAge });

        // Update the goal weight in the session
        req.session.user.age = newAge;

        res.redirect('/settings');
    } catch (error) {
        console.log(error);
        res.redirect(`error?message=${encodeURIComponent(error.message)}`);
    }
});

// Email Update Route
app.post('/update-email', async(req, res) => {
    try {
        const user = req.session.user;
        const newEmail = req.body.email;

        // Update the user's goal weight in the database
        await User.updateOne({ _id: user.id }, { email: newEmail });

        // Update the goal weight in the session
        req.session.user.email = newEmail;

        res.redirect('/settings');
    } catch (error) {
        console.log(error);
        res.redirect(`error?message=${encodeURIComponent(error.message)}`);
    }
});

// Username Update Route
app.post('/update-username', async(req, res) => {
    try {
        const user = req.session.user;
        const newUsername = req.body.username;

        // Update the user's goal weight in the database
        await User.updateOne({ _id: user.id }, { username: newUsername });

        // Update the goal weight in the session
        req.session.user.username = newUsername;

        res.redirect('/settings');
    } catch (error) {
        console.log(error);
        res.redirect(`error?message=${encodeURIComponent(error.message)}`);
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
    const errorMessage = '404 - Page not found';
    res.redirect(`/error?message=${encodeURIComponent(errorMessage)}`);
});


// Launch app to listen to specified port
app.listen(process.env.PORT || 3000, () => {
    console.log('server is running on port 3000');
});