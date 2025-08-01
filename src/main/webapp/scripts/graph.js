const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const rSelect = document.getElementById('r');
let currentR = 4;

function drawGraph(R) {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scaleX = width / 11;
    const scaleY = height / 11;

    ctx.clearRect(0, 0, width, height);

    ctx.lineWidth = 2;

    // фигуры
    ctx.fillStyle = 'rgba(163,65,161,0.55)';

    ctx.beginPath();
    ctx.moveTo(centerX, centerY + R * scaleY);
    ctx.lineTo(centerX - R * scaleX, centerY);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, R * scaleY, Math.PI, -1 / 2 * Math.PI);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX + R * scaleX, centerY);
    ctx.lineTo(centerX, centerY);
    ctx.lineTo(centerX, centerY - R * scaleY);
    ctx.lineTo(centerX + R * scaleX, centerY - R * scaleY);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#2d4057';
    ctx.fillStyle = '#2d4057';
    ctx.font = '16px Arial';

    // ось x + стрелка
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width - 5, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width - 15, centerY - 5);
    ctx.lineTo(width - 5, centerY);
    ctx.lineTo(width - 15, centerY + 5);
    ctx.fill();

    [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].forEach(x => {
        const xPos = centerX + x * scaleX;
        ctx.beginPath();
        ctx.moveTo(xPos, centerY - 5);
        ctx.lineTo(xPos, centerY + 5);
        ctx.stroke();
        ctx.fillText(x.toString(), xPos - 5, centerY + 20);
    });

    // ось y + стрелка
    ctx.beginPath();
    ctx.moveTo(centerX, height);
    ctx.lineTo(centerX, 5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX - 5, 15);
    ctx.lineTo(centerX, 5);
    ctx.lineTo(centerX + 5, 15);
    ctx.fill();

    [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].forEach(y => {
        const yPos = centerY - y * scaleY;
        ctx.beginPath();
        ctx.moveTo(centerX - 5, yPos);
        ctx.lineTo(centerX + 5, yPos);
        ctx.stroke();
        ctx.fillText(y.toString(), centerX + 10, yPos + 5);
    });

    // 0
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.moveTo(centerX, centerY);
    ctx.stroke();
    ctx.fillText("0", centerX + 10, centerY + 20);

    drawPointsFromSession();
}

rSelect.addEventListener('change', () => {
    const newR = parseFloat(rSelect.value);
    if (newR) {
        currentR = newR;
        drawGraph(currentR);
    }
    saveFormState();
});

function getCanvasData(event) {
    const rect = canvas.getBoundingClientRect();
    const newWidth = canvas.offsetWidth;
    const newHeight = canvas.offsetHeight;
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const centerX = newWidth / 2;
    const centerY = newHeight / 2;
    const scaleX = newWidth / 11;
    const scaleY = newHeight / 11;
    const x = ((clickX - centerX) / scaleX).toFixed(4);
    const y = -((clickY - centerY) / scaleY).toFixed(4);
    const r = rSelect.value;
    const method = document.querySelector('input[name="method"]:checked')?.value || 'POST';
    return { x, yValues: [y], r, method };
}

function drawPointsFromSession() {
    if (!window.ALL_POINTS_FROM_SESSION || ALL_POINTS_FROM_SESSION.length === 0) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scaleX = width / 11;
    const scaleY = height / 11;

    ALL_POINTS_FROM_SESSION.forEach(point => {
        const canvasX = centerX + point.x * scaleX;
        const canvasY = centerY - point.y * scaleY;

        ctx.beginPath();
        if (point.isLast) {
            ctx.fillStyle = point.hit ? '#00805a' : '#ff0059';
        } else {
            ctx.fillStyle = '#656570';
        }
        ctx.arc(canvasX, canvasY, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
}