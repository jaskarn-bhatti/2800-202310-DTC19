document.addEventListener('DOMContentLoaded', function() {
    var gameContainer = document.getElementById('game-container');
    var scoreDisplay = document.getElementById('score');
    var score = 0;
    var gameDuration = 30; // seconds
    var iconInterval;
    var gameTimer;
    var isSpeedIncreased = false;

    gameContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('icon')) {
            event.target.style.display = 'none';
            score++;
            updateScore();
        }
    });

    function updateScore() {
        scoreDisplay.textContent = 'Score: ' + score;
    }

    function startGame() {
        score = 0;
        updateScore();

        iconInterval = setInterval(showIcon, 2000);
        gameTimer = setTimeout(endGame, gameDuration * 1000);
    }

    function showIcon() {
        var icon = document.createElement('div');
        icon.className = 'icon';
        var containerWidth = gameContainer.offsetWidth;
        var containerHeight = gameContainer.offsetHeight;
        var iconSize = Math.min(containerWidth, containerHeight) * 0.15; // Adjust the scale factor as needed
        icon.style.width = iconSize + 'px';
        icon.style.height = iconSize + 'px';
        icon.style.left = getRandomPosition(0, containerWidth - iconSize) + 'px';
        icon.style.top = getRandomPosition(0, containerHeight - iconSize) + 'px';
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

    function endGame() {
        clearInterval(iconInterval);
        clearTimeout(gameTimer);

        // Remove all icons from the game container
        var icons = gameContainer.getElementsByClassName('icon');
        while (icons.length > 0) {
            icons[0].parentNode.removeChild(icons[0]);
        }


        if (score < 10) {
            scoreDisplay.innerHTML = 'Game Over! Final Score: ' + score + `<br>`;
            scoreDisplay.innerHTML += 'You need to click faster!';
            scoreDisplay.style.color = 'red';
            document.body.style.backgroundColor = "#C2EABD";
        } else if (score < 15) {
            scoreDisplay.innerHTML = 'Game Over! Final Score: ' + score + `<br>`;
            scoreDisplay.innerHTML += "You're pretty good!";
            scoreDisplay.style.color = 'blue';
            document.body.style.backgroundColor = "#96C0B7";
        } else {
            scoreDisplay.innerHTML = 'Game Over! Final Score: ' + score + `<br>`;
            scoreDisplay.innerHTML += 'You are a master!';
            scoreDisplay.style.color = 'green';
            document.body.style.backgroundColor = "#AD91A3";
        }
    }

    function getRandomPosition(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

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

        gameContainer.style.width = containerWidth + 'px';
        gameContainer.style.height = containerHeight + 'px';
    }

    // Call the updateGameContainerSize function initially and when the window is resized
    updateGameContainerSize();
    window.addEventListener('resize', updateGameContainerSize);

    startGame();
});