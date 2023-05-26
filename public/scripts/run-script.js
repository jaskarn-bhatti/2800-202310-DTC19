let interval = null;
let time;
let duration;

// Display time in MM:SS format
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Start the timer
function startTimer() {
    clearInterval(interval);
    let timerProgress = document.getElementById("timerProgress");
    let countdownTime = document.getElementById("countdownTime");
    let width = 0;
    time = duration;
    countdownTime.textContent = formatTime(time); // Display initial time
    interval = setInterval(() => {
        if (width >= 100 || time <= 0) { // Stop the timer when width reaches 100 or time is less than or equal to 0
            clearInterval(interval);
            time = 0; // Set time to 0 to ensure it displays 00:00
            toggleCompleteButtonVisibility(); // Show the complete button
        } else {
            time -= 1; // Decrease the countdown time
            countdownTime.textContent = formatTime(time); // Update the countdown time
            width = ((duration - time) / duration) * 100; // Calculate the width based on remaining time
            timerProgress.style.width = width + "%";
        }
    }, 1000);
}

// Stop the timer
function stopTimer() {
    clearInterval(interval);
    interval = null;
    let timerProgress = document.getElementById("timerProgress");
    let countdownTime = document.getElementById("countdownTime");
    timerProgress.style.width = "0";
    countdownTime.textContent = formatTime(duration); // Reset the countdown time to the original duration
    toggleCompleteButtonVisibility(); // Hide or show the complete button based on conditions
}

// Restart the timer
function restartTimer() {
    stopTimer();
    startTimer();
    toggleCompleteButtonVisibility(); // Hide or show the complete button based on conditions
}

// Handle start button click
document.getElementById("startButton").addEventListener("click", function() {
    if (!interval) {
        duration = parseInt(document.getElementById("timeInput").value);
        startTimer();
        toggleCompleteButtonVisibility(); // Hide or show the complete button based on conditions
    }
});

// Handle time input with regex to ensure only numbers are entered
document.getElementById("timeInput").addEventListener("input", function() {
    const inputValue = timeInput.value.trim();
    const validInput = /^\-?\d+$/.test(inputValue);
  
    if (!validInput) {
      timeInput.value = '';
    }
});

// Handle stop button click
document.getElementById("stopButton").addEventListener("click", function() {
    stopTimer();
    toggleCompleteButtonVisibility(); // Hide or show the complete button based on conditions
});

// Handle restart button click
document.getElementById("restartButton").addEventListener("click", function() {
    restartTimer();
    toggleCompleteButtonVisibility(); // Hide or show the complete button based on conditions
});

// Get references to the necessary DOM elements
const completeButton = document.getElementById("completeButton");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const restartButton = document.getElementById("restartButton");

// Function to toggle the visibility of the completeButton
function toggleCompleteButtonVisibility() {
    completeButton.style.display = (interval === null || time <= 0) ? "block" : "none";
}

// Handler function for the Complete Run button
function completeRun() {
    const totalTimeTaken = duration - time;
    window.location.href = "/complete-exercise?time=" + totalTimeTaken;
}

// Complete Run button click event listener
completeButton.addEventListener("click", completeRun);
