const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const size = 100;
let currentSymbol = 'X';

ctx.lineCap = 'round';
ctx.lineJoin = 'round';

const grid = Array(3).fill(null).map(() => Array(3).fill(null));

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#22333b';
    ctx.lineWidth = 8;

    // Vertical Lines
    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(i * size, 10);
        ctx.lineTo(i * size, canvas.height - 10);
        ctx.stroke();
    }

    // Horizontal Lines
    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(10, i * size);
        ctx.lineTo(canvas.width - 10, i * size);
        ctx.stroke();
    }
}

function drawSymbol(x, y, symbol) {
    const cx = x * size + size / 2;
    const cy = y * size + size / 2;

    if (symbol === 'X') {
        ctx.strokeStyle = '#ff006e';
        ctx.beginPath();
        ctx.moveTo(cx - 30, cy - 30);
        ctx.lineTo(cx + 30, cy + 30);
        ctx.moveTo(cx + 30, cy - 30);
        ctx.lineTo(cx - 30, cy + 30);
        ctx.stroke();
    } else if (symbol === 'O') {
        ctx.strokeStyle = '#3a86ff';
        ctx.beginPath();
        ctx.arc(cx, cy, 30, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function checkWin(grid) {
    const winPatterns = [
        // Rows
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // Columns
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        // Diagonals
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        const value = grid[a[0]][a[1]];
        if (value && value === grid[b[0]][b[1]] && value === grid[c[0]][c[1]]) {
            drawLine(a, b, c);
            return true;
        }
    }
    return false;
}

function drawLine(a, b, c) {
    const x1 = a[1] * size + size / 2;
    const y1 = a[0] * size + size / 2;
    const x2 = c[1] * size + size / 2;
    const y2 = c[0] * size + size / 2;
    ctx.strokeStyle = '#7b2cbf';;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / size);
    const y = Math.floor((event.clientY - rect.top) / size);

    if (grid[y][x] || checkWin(grid)) return;

    grid[y][x] = currentSymbol;
    drawSymbol(x, y, currentSymbol);

    if (!checkWin(grid)) {
        currentSymbol = currentSymbol === 'X' ? 'O' : 'X';
    }
}

function reset() {
    grid.forEach(row => row.fill(null));
    drawGrid();
    currentPlayer = 'X';
}

canvas.addEventListener('click', handleClick);
document.getElementById('restart').addEventListener('click', reset);
drawGrid();

