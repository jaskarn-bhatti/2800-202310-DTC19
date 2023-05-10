//Load modules
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

//Create express app
const app = express();

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

app.get('/login', (req, res) => {
    res.send(`
        <h1>Login</h1>
        <form action="/login" method="POST">
            <label for ="username">Username</label>
            <input type="text" name="username" id="username" required><br>
            <label for ="password">Password</label>
            <input type="password" name="password" id="password" required><br>
            <input type="submit" value="Login">
        </form>
        <a href="/register">Register</a>
        <a href="/forgot">Forgot Password</a>`);
});


// Launch app to listen to specified port
app.listen(process.env.PORT || 3000, () => {
    console.log('server is running on port 3000');
});