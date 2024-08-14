const gameArea = document.getElementById('gameArea');
const ball = document.getElementById('ball');
const playerPaddle = document.getElementById('playerPaddle');
const computerPaddle = document.getElementById('computerPaddle');
const playerScoreElem = document.getElementById('playerScore');
const computerScoreElem = document.getElementById('computerScore');

let ballX = 290, ballY = 190;
let ballSpeedX = 5, ballSpeedY = 5;
let playerScore = 0, computerScore = 0;
let playerPaddleY = 160, computerPaddleY = 160;
let computerPaddleSpeed = 4;
let level = 1;

function resetBall() {
    ballX = gameArea.clientWidth / 2 - 10;
    ballY = gameArea.clientHeight / 2 - 10;
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 3);
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * (5 + Math.random() * 3);
}

function levelUp() {
    level++;
    computerPaddleSpeed += 2;  // Gegner wird schneller
    resetBall();
}

function update() {
    moveBall();
    movePaddles();
    checkCollisions();
    updateScores();
    updatePositions();

    requestAnimationFrame(update);
}

function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY >= gameArea.clientHeight - 20) {
        ballSpeedY *= -1;
    }
}

function movePaddles() {
    // Spielersteuerung durch Berührung (Touch)
    playerPaddleY = Math.min(Math.max(playerPaddleY, 0), gameArea.clientHeight - playerPaddle.clientHeight);
    playerPaddle.style.top = `${playerPaddleY}px`;

    // Einfacher KI-Algorithmus für den Gegner
    if (computerPaddleY + 40 < ballY) {
        computerPaddleY += computerPaddleSpeed;
    } else {
        computerPaddleY -= computerPaddleSpeed;
    }
    computerPaddleY = Math.min(Math.max(computerPaddleY, 0), gameArea.clientHeight - computerPaddle.clientHeight);
    computerPaddle.style.top = `${computerPaddleY}px`;
}

function checkCollisions() {
    if (ballX <= 20 && ballY >= playerPaddleY && ballY <= playerPaddleY + playerPaddle.clientHeight) {
        ballSpeedX *= -1.1;
        ballX = 20;
    }

    if (ballX >= gameArea.clientWidth - 30 && ballY >= computerPaddleY && ballY <= computerPaddleY + computerPaddle.clientHeight) {
        ballSpeedX *= -1.1;
        ballX = gameArea.clientWidth - 30;
    }
}

function updateScores() {
    if (ballX <= 0) {  // Spieler hat verfehlt, Computer bekommt einen Punkt
        computerScore++;
        computerScoreElem.textContent = computerScore;
        if (computerScore >= 5) {
            alert("Game Over! Du hast verloren.");
            resetGame();
        } else {
            resetBall();
        }
    }

    if (ballX >= gameArea.clientWidth - 20) {  // Computer hat verfehlt, Spieler bekommt einen Punkt
        playerScore++;
        playerScoreElem.textContent = playerScore;
        if (playerScore >= 5) {
            alert("Glückwunsch! Du hast das Level gewonnen.");
            levelUp();
        } else {
            resetBall();
        }
    }
}

function updatePositions() {
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    computerPaddleSpeed = 4;
    playerScoreElem.textContent = playerScore;
    computerScoreElem.textContent = computerScore;
    resetBall();
}

// Steuerung des Spielerschlägers durch Touch
gameArea.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY - gameArea.getBoundingClientRect().top;
    playerPaddleY = touchY - playerPaddle.clientHeight / 2;
});

// Start des Spiels
resetGame();
update();