// Save and Load difficulty Level
document.addEventListener('DOMContentLoaded', () => {

    function saveDifficulty() {
        const value = diff.value;
        localStorage.setItem('difficultyFlag', value);
    }

    function loadDifficulty() {
        const savedValue = localStorage.getItem('difficultyFlag');
        if (savedValue)  diff.value = savedValue; 
        else diff.value = 'Effortless';
    }

    loadDifficulty();

    diff.addEventListener('change', saveDifficulty);
});

function handleDifficulty() {
         if (diff.value === 'Effortless') difficulty = 1;
    else if (diff.value === 'Easy') difficulty = 2;
    else if (diff.value === 'Intermediate') difficulty = 3;
    else if (diff.value === 'Hard') difficulty = 4;
    else if (diff.value === 'Impossible') difficulty = 5;
};

diff.addEventListener('change', handleDifficulty);

handleDifficulty();

function aiMove() {

    setTimeout(() => {
        if (gameOver || isResetting) return;

        if (difficulty === 1) effortlessMove();
        else if (difficulty === 2) easyMove();
        else if (difficulty === 3) intermediateMove();
        else if (difficulty === 4) hardMove();
        else if (difficulty === 5) impossibleMove();
    }, 2000);
}

// Effortless 

function effortlessMove() {
    if (gameOver) return;

    const emptyCells = [];
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            if (!grid[y][x]) {
                emptyCells.push({x, y});
            }
        }
    }
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const {x, y} = emptyCells[randomIndex];
    handleMove(x, y, 'O');

    aiTurn = false;
}

// Easy 

function easyMove() {
    if (Math.random() < 0.5) effortlessMove();
    else intermediateMove();
}

// Medium

function intermediateMove() {
    if (gameOver) return;
    let move = findWinningMove('O') || findWinningMove('X');

    if (move)  handleMove(move[0], move[1], 'O');
    else effortlessMove();
    aiTurn = false;
}

function findWinningMove(symbol) {
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        
        const values = [grid[a[1]][a[0]], grid[b[1]][b[0]], grid[c[1]][c[0]]];
        const emptyIndex = values.indexOf(null);

        if (emptyIndex !== -1 && values.filter(cell => cell === symbol).length === 2) {
            return pattern[emptyIndex];
        }
    }
    return null;
}

// Hard

function hardMove() {
    if (Math.random() < 0.4) intermediateMove();
    else impossibleMove();
}

// Impossible

function impossibleMove() {
    if (gameOver) return;
    let bestScore = -Infinity;
    let bestMove = null;

    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            if (!grid[y][x]) {
                grid[y][x] = 'O'; 
                let score = minimax(grid, 0, false);
                grid[y][x] = null; 

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = [x, y];
                }
            }
        }
    }

    if (bestMove) {
        handleMove(bestMove[0], bestMove[1], 'O');
    }
    aiTurn = false;
}

function minimax(grid, depth, isMaximizing) {
    const winner = checkBestWin(grid);
    if (winner === 'X') return -10;
    if (winner === 'O') return 10; 
    if (isGridFull()) return 0;   

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                if (!grid[y][x]) {
                    grid[y][x] = 'O'; 
                    let score = minimax(grid, depth + 1, false);
                    grid[y][x] = null; 
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                if (!grid[y][x]) {
                    grid[y][x] = 'X'; 
                    let score = minimax(grid, depth + 1, true);
                    grid[y][x] = null; 
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

function checkBestWin(grid) {

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        const value = grid[a[0]][a[1]];
        if (value && value === grid[b[0]][b[1]] && value === grid[c[0]][c[1]]) {
            return value;
        }
    }
    return null;
}
