// Initializing constants and variables
const statusText = document.getElementById('status');
const diff = document.getElementById('difficulty');
const canvas = document.getElementById('canvas');
const rst = document.getElementById('restart');
const ctx = canvas.getContext('2d');
const size = 100;

const grid = Array(3).fill(null).map(() => 
             Array(3).fill(null));

const winPatterns = [
// Rows
...[0, 1, 2].map(i => [[i, 0], [i, 1], [i, 2]]),
// Columns
...[0, 1, 2].map(i => [[0, i], [1, i], [2, i]]),
// Diagonals
   [0, 1, 2].map(i => [i, i]),
   [0, 1, 2].map(i => [i, 2 - i])
];

var gameOver = false;
var isResetting = false;

let aiTurn = false;
let currentSymbol = 'X';

// Canvas setup
canvas.width = 300;
canvas.height = 300;
canvas.addEventListener('click', handleClick);

ctx.lineCap = 'round';
ctx.lineJoin = 'round';

diff.disabled = true;
diff.value = diff.value;
rst.addEventListener('click', reset);

// Main
function checkWin(grid) {

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        const value = grid[a[0]][a[1]];
        if (value && value === grid[b[0]][b[1]] && value === grid[c[0]][c[1]]) {
            drawLine(a, b, c);
            return value;
        }
    }
    return null;
}

function handleMove(x, y, symbol) {

    grid[y][x] = symbol;
    drawSymbol(x, y, symbol);

    const winner = checkWin(grid);
    if (winner) {
        statusText.innerText = winner === 'X' ? 'You Won' : 'AI Won';
        statusText.style.color = winner === 'X' ? '#ff006e' : '#3a86ff';
        gameOver = true;
        diff.disabled = false;
    } else if (isGridFull()) {
        statusText.innerText = `It's a Tie`;
        statusText.style.color = '#8900f2';
        gameOver = true;
        diff.disabled = false;
    } else {
        currentSymbol = symbol === 'X' ? 'O' : 'X';
        updateStatusText();
        if (currentSymbol === 'O') {
            aiTurn = true;
            aiMove();
        }
    }
}

function handleClick(event) {
    if (gameOver || aiTurn) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / size);
    const y = Math.floor((event.clientY - rect.top) / size);

    if (!grid[y][x]) {
        handleMove(x, y, currentSymbol);
    }
}

function updateStatusText() {
    statusText.innerText = currentSymbol === 'X' ? 'Your Turn' : `AI's Turn`;
    statusText.style.color = currentSymbol === 'X' ? '#ff006e' : '#3a86ff';
}

function isGridFull() {
    return grid.every(row => row.every(cell => cell));
}

function reset() {

    isResetting = true;
    diff.disabled = true;

    grid.forEach(row => row.fill(null));
    currentSymbol = 'X';
    aiTurn = false;
    gameOver = false;

    drawGrid();
    updateStatusText();

    setTimeout(() =>  isResetting = false, 2000);
}

drawGrid();
updateStatusText();
