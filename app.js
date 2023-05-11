//Load modules
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Joi = require('joi');

const port = process.env.PORT || 3000;

//Create express app
const app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');

//Setup session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    }
}));

//Database connection
//Not done yet

// Root Route
app.get('/', (req, res) => {
    //If user, redirect to home
    
    //Else, redirect to login
    res.redirect('/login');
});

// Login Route
app.get('/login', (req, res) => {
    res.render('pages/login');
});

// Signup Route
app.get('/signup', (req, res) => {
    res.render('pages/signup');
});



// Launch app to listen to specified port
app.listen(process.env.PORT || 3000, () => {
    console.log('server is running on port 3000');
});