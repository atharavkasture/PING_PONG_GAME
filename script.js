const pongCanvas = document.getElementById('pongCanvas');
const pongContext = pongCanvas.getContext('2d');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');

const WINDOW_WIDTH = 800;
const WINDOW_HEIGHT = 600;

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;

let ball = {
    x: WINDOW_WIDTH / 2 - BALL_SIZE / 2,
    y: WINDOW_HEIGHT / 2 - BALL_SIZE / 2,
    width: BALL_SIZE,
    height: BALL_SIZE,
    dx: 5,
    dy: 5
};

let leftPaddle = {
    x: 20,
    y: WINDOW_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

let rightPaddle = {
    x: WINDOW_WIDTH - 30,
    y: WINDOW_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

let leftScore = 0;
let rightScore = 0;

let gameRunning = false;
let animationFrameId = null;

function drawRect(ctx, x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawBall() {
    drawRect(pongContext, ball.x, ball.y, ball.width, ball.height, 'red');
}

function drawPaddles() {
    drawRect(pongContext, leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, 'green');
    drawRect(pongContext, rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, 'green');
}

function drawScores() {
    pongContext.fillStyle = 'white';
    pongContext.font = '20px Arial';
    pongContext.fillText(`Left Score: ${leftScore}`, 20, 20);
    pongContext.fillText(`Right Score: ${rightScore}`, WINDOW_WIDTH - 140, 20);
}

function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // ball collision with vertical walls
    if (ball.y <= 0 || ball.y + ball.height >= WINDOW_HEIGHT) {
        ball.dy *= -1;
    }

    // ball collision with horizontal walls
    if (ball.x <= 0) {
        rightScore++;
        resetBall();
    } else if (ball.x + ball.width >= WINDOW_WIDTH) {
        leftScore++;
        resetBall();
    }

    // ball collision with left paddle
    if (ball.x < leftPaddle.x + leftPaddle.width &&
        ball.x + ball.width > leftPaddle.x &&
        ball.y < leftPaddle.y + leftPaddle.height &&
        ball.y + ball.height > leftPaddle.y) {
        ball.dx *= -1;
    }

    // ball collosion with right paddle
    if (ball.x < rightPaddle.x + rightPaddle.width &&
        ball.x + ball.width > rightPaddle.x &&
        ball.y < rightPaddle.y + rightPaddle.height &&
        ball.y + ball.height > rightPaddle.y) {
        ball.dx *= -1;
    }
}

function resetBall() {
    ball.x = WINDOW_WIDTH / 2 - BALL_SIZE / 2;
    ball.y = WINDOW_HEIGHT / 2 - BALL_SIZE / 2;
    ball.dx = 5;
    ball.dy = 5;
}

function updatePaddles() {
    if (leftPaddle.y + leftPaddle.dy > 0 && leftPaddle.y + leftPaddle.height + leftPaddle.dy < WINDOW_HEIGHT) {
        leftPaddle.y += leftPaddle.dy;
    }

    if (rightPaddle.y + rightPaddle.dy > 0 && rightPaddle.y + rightPaddle.height + rightPaddle.dy < WINDOW_HEIGHT) {
        rightPaddle.y += rightPaddle.dy;
    }
}

function pongGameLoop() {
    pongContext.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

    drawBall();
    drawPaddles();
    drawScores();

    updateBall();
    updatePaddles();

    animationFrameId = requestAnimationFrame(pongGameLoop);
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        // Reset game state before starting
        resetGame();
        // Start the game loop
        pongGameLoop();
    }
}

function stopGame() {
    gameRunning = false;
    cancelAnimationFrame(animationFrameId);
}

function resetGame() {
    leftScore = 0;
    rightScore = 0;
    resetBall();
    leftPaddle.y = WINDOW_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    rightPaddle.y = WINDOW_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    leftPaddle.dy = 0;
    rightPaddle.dy = 0;
}

startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', stopGame);

document.addEventListener('keydown', (event) => {
    if (!gameRunning) return;

    switch (event.key) {
        case 'w':
            leftPaddle.dy = -5;
            break;
        case 's':
            leftPaddle.dy = 5;
            break;
        case 'i':
            rightPaddle.dy = -5;
            break;
        case 'k':
            rightPaddle.dy = 5;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    if (!gameRunning) return;

    switch (event.key) {
        case 'w':
        case 's':
            leftPaddle.dy = 0;
            break;
        case 'i':
        case 'k':
            rightPaddle.dy = 0;
            break;
    }
});

// Explicitly stops the game loop when user navigates away from the web page or closes the browser
window.addEventListener('beforeunload', stopGame);
