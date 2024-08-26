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

function drawLine(a, b, c) {
    const x1 = a[1] * size + size / 2;
    const y1 = a[0] * size + size / 2;
    const x2 = c[1] * size + size / 2;
    const y2 = c[0] * size + size / 2;
    ctx.strokeStyle = '#8900f2';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
