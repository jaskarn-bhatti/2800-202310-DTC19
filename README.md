# 2800-202310-DTC19
2800 Project 2 DTC-19

# FitTrack

## Project Description
FitTrack is a step-based fitness tracker designed to help newcomer or busy professionals get started and meet their health related goals.

## Technologies Used
To create our app, used the following technologies:
- **Visual Studio Code:** as our main code editor.
- **Node.js and Express:** for our server backend code.
- **EJS:** to template our HTML files.
- **Bootstrap:** for styling and CSS.
- **MongoDB:** to handle our databases.

## File Contents and Folders
    C:.
    ├── index.js
    ├── package.json
    ├── README.md
    ├── Tree.txt
    ├── models
    │   ├── user.js
    │   └── userLog.js
    ├── public
    │   ├── css
    │   │   ├── easter-egg.css
    │   │   ├── error.css
    │   │   ├── general-styles.css
    │   │   ├── home.css
    │   │   └── run-timer.css
    │   ├── icons
    │   │   ├── background.png
    │   │   ├── bar-chart-fill.svg
    │   │   ├── house-door-fill.svg
    │   │   ├── jordan-1.png
    │   │   ├── person-running-solid.svg
    │   │   └── pool.png
    │   └── scripts
    │       ├── complete-exercise-script.js
    │       ├── easteregg-script.js
    │       └── run-script.js
    ├── scss
    │   └── custom.scss
    └── views
        ├── pages
        │   ├── complete-exercise.ejs
        │   ├── easter-egg.ejs
        │   ├── error.ejs
        │   ├── home.ejs
        │   ├── index.ejs
        │   ├── login.ejs
        │   ├── profile.ejs
        │   ├── progress.ejs
        │   ├── run.ejs
        │   ├── settings.ejs
        │   ├── signup-metrics.ejs
        │   └── signup.ejs
        └── partials
            ├── footer.ejs
            ├── head.ejs
            └── header.ejs

## How To Run This Project
1. Ensure you have a code editor capable of running JavaScript. Visual Studio Code is highly recommended.
2. This project makes use of the following: node.js, express, EJS, and MongoDB. Ensure that these are installed by using the following commands:
    - npm i node
    - npm i express
    - npm i ejs
    - npm i mongodb
    - npm i mongoose
3. You will require the .env which contains the session secret and MongoDB user account
4. First install the necessary frameworks and dependencies. After which you will be able to start working on the app.
5. You can find the testing log we used for this project [here](https://docs.google.com/spreadsheets/d/1_2-d7ZmiL-q3kv_4VOZSeDP-_cf-hT-Ey5_H96AAZAg/edit?usp=sharing)

## How To Use This App
The app has a few core features, they are:
1. **Run** 
- Users can input an amount of time they want to exercise for, afterwards the timer will start ticking down. 
- Once the time is up, or the time is stopped manually, they can proceed to the complete exercise page.
- Enter number of steps taken (from an external source), and select exercise type (run / walk). A dynamic display of calories burned will appear.
- Select "save exercise" to save it to UserLogs.
2. **View Progress**
- Users can view their progress at any time.
- Select the date and time of the exercise entry.
- All relevant information is displayed (time, steps, calories)

## Credits
This app was created by the following team members of DTC-19:
- Ediljohn
- Jaskarn

## Usage of AI
- We used AI to help us ideate the app, for generating ideas and names. During development, we used it to help us create complicated blocks of code (such as the RegEX), and for fixing bugs.
- We planned to incorporate AI to analyze a dataset we found of fitness tracker metrics. This would have been used to provide recommendations to users for personalized results.
- As mentioned previously, we wanted to implement AI recommendations based on our dataset. We had to pivot away from this idea in order to make a functioning product in time.
- AI sometimes does not give you the results you want. We found that we had to fine-tune our results by continuously inputting prompts, or starting new prompts if fixes could not be found.

## Contact Information
We can be contacted by email:
- **Ediljohn:** ejoson1@my.bcit.ca
- **Jaskarn:** jaskarnbhatti204@gmail.com



