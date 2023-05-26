// Load the script on page load
document.addEventListener("DOMContentLoaded", function() {
    // Declare variables
    var gameContainer = document.getElementById("game-container");
    var scoreDisplay = document.getElementById("score");
    var score = 0;
    var gameDuration = 30; // seconds
    var iconInterval;
    var gameTimer;
    var isSpeedIncreased = false;

    // Handle icons being clicked
    gameContainer.addEventListener("click", function(event) {
        if (event.target.classList.contains("icon")) {
            event.target.style.display = "none";
            score++;
            updateScore();
        }
    });

    // Update the score display
    function updateScore() {
        scoreDisplay.textContent = "Score: " + score;
    }

    // Start the game
    function startGame() {
        score = 0;
        updateScore();

        iconInterval = setInterval(showIcon, 2000);
        gameTimer = setTimeout(endGame, gameDuration * 1000);
    }

    // Show an icon in a random position
    function showIcon() {
        var containerWidth = gameContainer.offsetWidth;
        var containerHeight = gameContainer.offsetHeight;
        var icon = document.createElement("div");
        icon.className = "icon";
        var iconSize = Math.min(containerWidth, containerHeight) * 0.15;
        icon.style.width = iconSize + "px";
        icon.style.height = iconSize + "px";
        icon.style.left = getRandomPosition(0, containerWidth - iconSize) + "px";
        icon.style.top = getRandomPosition(0, containerHeight - iconSize) + "px";
        gameContainer.appendChild(icon);

        setTimeout(function() {
            gameContainer.removeChild(icon);
        }, 5000);

        if (!isSpeedIncreased && score >= 10) {
            clearInterval(iconInterval);
            iconInterval = setInterval(showIcon, 500);
            isSpeedIncreased = true;
        }
    }

    // End the game
    function endGame() {
        clearInterval(iconInterval);
        clearTimeout(gameTimer);

        // Remove all icons from the game container
        var icons = gameContainer.getElementsByClassName("icon");
        while (icons.length > 0) {
            icons[0].parentNode.removeChild(icons[0]);
        }

        // Display message based on score
        if (score < 10) {
            scoreDisplay.innerHTML = "Game Over! Final Score: " + score + "<br>";
            scoreDisplay.innerHTML += "You need to click faster!";
            scoreDisplay.style.color = "red";
            document.body.style.backgroundColor = "#C2EABD";
        } else if (score < 15) {
            scoreDisplay.innerHTML = "Game Over! Final Score: " + score + "<br>";
            scoreDisplay.innerHTML += "You're pretty good!";
            scoreDisplay.style.color = "blue";
            document.body.style.backgroundColor = "#96C0B7";
        } else {
            scoreDisplay.innerHTML = "Game Over! Final Score: " + score + "<br>";
            scoreDisplay.innerHTML += "You are a master!";
            scoreDisplay.style.color = "green";
            document.body.style.backgroundColor = "#AD91A3";
        }
    }

    // Get a random position between min and max
    function getRandomPosition(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Update playing area size based on screen size
    function updateGameContainerSize() {
        var screenWidth = window.innerWidth;
        var screenHeight = window.innerHeight;
        var containerWidth;

        if (screenWidth > 700 && screenWidth <= 1000) {
            containerWidth = 400; // Fixed size for screens between 700px and 1000px
        } else if (screenWidth > 900) {
            containerWidth = 500; // Fixed size for screens larger than 1000px
        } else {
            containerWidth = Math.min(screenWidth - 40, screenHeight * 1.667); // Adjust the aspect ratio as needed
        }

        var containerHeight = containerWidth / 1.667; // Adjust the aspect ratio as needed

        gameContainer.style.width = containerWidth + "px";
        gameContainer.style.height = containerHeight + "px";
    }

    // Call the updateGameContainerSize function initially and when the window is resized
    updateGameContainerSize();
    window.addEventListener("resize", updateGameContainerSize);

    startGame();
});
