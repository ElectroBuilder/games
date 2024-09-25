// Initializing constants and variables
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const boardSize = 25;

let foodX, foodY, snakeBody = [];
let velocityX = 0, velocityY = 0;
let snakeX = 5, snakeY = 10, score = 0;
let gameOver = false, directionChanged = false;
let highScore = localStorage.getItem('high-score') || 0;

playBoard.innerHTML = "";

// Functions
const directionMap = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowRight: { x: 1, y: 0 },
    ArrowLeft: { x: -1, y: 0 }
};

const changeDirection = (direction) => {
    if (!directionChanged && direction
    && (velocityX !== -direction.x || velocityY !== -direction.y)) {
        velocityX = direction.x;
        velocityY = direction.y;
        directionChanged = true; 
}};

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * boardSize) + 1;
    foodY = Math.floor(Math.random() * boardSize) + 1;
};

const updateScore = () => {
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
};

const handleGameOver = () => {
    document.querySelector('.game-over').style.display = 'block';
    document.getElementById('restart').addEventListener('click', () => location.reload());
};

const checkCollision = () => {
    if (
        snakeX < 1 || snakeY < 1 || 
        snakeX > boardSize || snakeY > boardSize || 
        snakeBody.slice(1).some(([x, y]) => x === snakeX && y === snakeY)
    ) {
        gameOver = true;
        handleGameOver();
        return;
    }
}

// Main
const initializeGame = () => {
    if (gameOver) return;
    checkCollision();

    // Food consumption
    if (snakeX === foodX && snakeY === foodY) {
        score++;
        highScore = Math.max(score, highScore);
        localStorage.setItem('high-score', highScore);
        updateScore();
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); // Grow snake
    }

    // Move the snake by adding head and removing tail
    snakeBody = [[snakeX, snakeY], ...snakeBody.slice(0, -1)];
    snakeX += velocityX;
    snakeY += velocityY;
    
    checkCollision();

    // Update board
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    snakeBody.forEach(([x, y]) => {
        htmlMarkup += `<div class="head" style="grid-area: ${y} / ${x}"></div>`;
    });

    playBoard.innerHTML = htmlMarkup;
};

// Touch Controls
controls.forEach(key => {
    key.addEventListener('click', () => changeDirection(directionMap[key.dataset.key]));
});

// Keyboard Controls
document.addEventListener('keydown', (e) => {
    if (directionMap[e.key]) {
        changeDirection(directionMap[e.key]);
    }
});

// Control game speed and rendering
let lastRenderTime = 0;
const updateInterval = 100; // Milliseconds

const gameLoop = (currentTime) => {
    const timeSinceLastRender = currentTime - lastRenderTime;

    if (timeSinceLastRender >= updateInterval) {
        lastRenderTime = currentTime;
        directionChanged = false; 
        initializeGame()
    }

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
};

changeFoodPosition(); // Initialize food position
requestAnimationFrame(gameLoop); // Start game loop