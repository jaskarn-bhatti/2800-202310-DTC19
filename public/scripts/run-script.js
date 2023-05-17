let interval = null;
let time;
let duration;

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
  clearInterval(interval);
  let timerProgress = document.getElementById('timerProgress');
  let countdownTime = document.getElementById('countdownTime');
  let width = 0;
  time = duration;
  countdownTime.textContent = formatTime(time); // Display initial time
  interval = setInterval(() => {
    if (width >= 100 || time <= 0) { // Stop the timer when width reaches 100 or time is less than or equal to 0
      clearInterval(interval);
      time = 0; // Set time to 0 to ensure it displays 00:00
    } else {
      time -= 1; // Decrease the countdown time
      countdownTime.textContent = formatTime(time); // Update the countdown time
      width = ((duration - time) / duration) * 100; // Calculate the width based on remaining time
      timerProgress.style.width = width + '%';
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
  interval = null;
  let timerProgress = document.getElementById('timerProgress');
  let countdownTime = document.getElementById('countdownTime');
  timerProgress.style.width = '0';
  countdownTime.textContent = formatTime(duration); // Reset the countdown time to the original duration
}

function restartTimer() {
  stopTimer();
  startTimer();
}

document.getElementById('startButton').addEventListener('click', function() {
  if (!interval) {
    duration = document.getElementById('timeInput').value;
    startTimer();
  }
});

document.getElementById('stopButton').addEventListener('click', function() {
  stopTimer();
});

document.getElementById('restartButton').addEventListener('click', function() {
  restartTimer();
});