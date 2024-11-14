const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const scaleInput = document.getElementById("scale");
scaleValue = parseInt(scaleInput.value)

let gridSize = canvas.width / scaleValue;
canvas.width = 500;
canvas.height = canvas.width;

const gridColor = '#d0c1c1';
let delay = 0;
// Рисуем сетку и оси координат
const drawGrid = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Сетка
    ctx.strokeStyle = gridColor;
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Оси координат
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    const centerX = Math.round(canvas.width / 2 / gridSize) * gridSize;
    const centerY = Math.round(canvas.height / 2 / gridSize) * gridSize;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();
    ctx.lineWidth = 1;
}

// Рисуем голубую линию от начальных до конечных координат
const drawBlueLine = (x1, y1, x2, y2) => {
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const centerX = Math.round(canvas.width / 2 / gridSize) * gridSize;
    const centerY = Math.round(canvas.height / 2 / gridSize) * gridSize;
    ctx.moveTo(centerX + x1 * gridSize, centerY - y1 * gridSize);
    ctx.lineTo(centerX + x2 * gridSize, centerY - y2 * gridSize);
    ctx.stroke();
    ctx.lineWidth = 1;
}

// Функция рисования желтых квадратов
const drawPixel = (x, y) => {
    setTimeout(() => {
        const centerX = Math.round(canvas.width / 2 / gridSize) * gridSize;
        const centerY = Math.round(canvas.height / 2 / gridSize) * gridSize;
        ctx.fillStyle = 'yellow';
        ctx.fillRect(centerX + x * gridSize, centerY - (y + 1)/* чтобы поднять на одну клетку вверх*/ * gridSize, gridSize, gridSize);
        
    }, delay);
}

// Пошаговый алгоритм
const stepAlgorithm = (x1, y1, x2, y2) => {
    // Вычисляем коэффициент наклона
    const k = (y2 - y1) / (x2 - x1);
    const b = y1 - k * x1;

    delay = 0;
    let x = x1;
    while (x <= x2) {
        // Вычисляем y по формуле y = kx + b
        let y = Math.round(k * x + b);
        drawPixel(x, y, delay); // Рисуем пиксель
        x++; // Увеличиваем x на 1
        delay+=50;
    }
    drawBlueLine(x1, y1, x2, y2);
}

// Алгоритм ЦДА
const ddaAlgorithm = (x1, y1, x2, y2) => {
    let dx = x2 - x1;
    let dy = y2 - y1;
    let steps = Math.max(Math.abs(dx), Math.abs(dy));
    let xIncrement = dx / steps;
    let yIncrement = dy / steps;
    let x = x1;
    let y = y1;
    delay = 0;
    for (let i = 0; i <= steps; i++) {
        drawPixel(Math.round(x), Math.round(y));
        x += xIncrement;
        y += yIncrement;
        delay += 50;
    }
    drawBlueLine(x1, y1, x2, y2);
}

// Алгоритм Брезенхема для линии
const bresenhamLine = (x0, y0, x1, y1) => {
    let deltax = Math.abs(x1 - x0);
    let deltay = Math.abs(y1 - y0);
    let error = 0;
    let deltaerr = deltay + 1;
    let y = y0;
    let diry = y1 - y0;
    diry = diry > 0 ? 1 : diry < 0 ? -1 : diry;

    // if (diry > 0){
    //     diry = 1;
    // }
    // if (diry < 0) {
    //     diry = -1;
    // }

    delay = 0;
    for (let x = x0; x <= x1; x++) {
        drawPixel(x, y);
        error += deltaerr;
        if (error >= deltax + 1) {
            y += diry;
            error -= deltax + 1;
        }
        delay += 50;
    }
    drawBlueLine(x0, y0, x1, y1);
};

// Алгоритм Брезенхема для окружности
const bresenhamCircle = (x0, y0, radius) => {
    let x = 0;
    let y = radius;
    let delta = 3 - 2 * radius;
    delay = 0;
    while (x <= y) {
        // Желтые квадраты по окружности
        drawPixel(x0 + x, y0 + y);
        drawPixel(x0 + x, y0 - y);
        drawPixel(x0 - x, y0 + y);
        drawPixel(x0 - x, y0 - y);
        drawPixel(x0 + y, y0 + x);
        drawPixel(x0 + y, y0 - x);
        drawPixel(x0 - y, y0 + x);
        drawPixel(x0 - y, y0 - x);
        delta += delta < 0 ? 4 * x + 6 : 4 * (x - y--) + 10;
        x++;
        delay += 50;
    }
}

const draw = () => {
    drawGrid(gridSize);
    const algorithm = document.getElementById("algorithm").value;
    const x1 = parseInt(document.getElementById("x1").value, 10);
    const y1 = parseInt(document.getElementById("y1").value, 10);

    if (algorithm === "bresenhamCircle") {
        const radius = parseInt(document.getElementById("R").value, 10);
        bresenhamCircle(x1, y1, radius);
        return;
    }

    const x2 = parseInt(document.getElementById("x2").value, 10);
    const y2 = parseInt(document.getElementById("y2").value, 10);
    switch (algorithm) {
        case "step":
            stepAlgorithm(x1, y1, x2, y2);
            break;
        case "dda":
            ddaAlgorithm(x1, y1, x2, y2);
            break;
        case "bresenhamLine":
            bresenhamLine(x1, y1, x2, y2);
            break;
    }
}
const algoritmInput = document.querySelector(".algorithm")
algoritmInput.addEventListener("change", () => {
    const endCoords = document.querySelector(".endCoords");
    const rValue = document.querySelector(".coordinatesR");
    
    if (document.querySelector(".algorithm").value === "bresenhamCircle") {
        endCoords.style.display = "none";
        rValue.style.display = "block"
    } else {
        endCoords.style.display = "block";
        rValue.style.display = "none"

    }
});

drawGrid();
const drawButton = document.querySelector('.drawButton');
drawButton.addEventListener('click', draw);

scaleInput.addEventListener("input", ()=>{
    console.log("called")
    scaleValue = parseInt(scaleInput.value)
    gridSize = canvas.width / scaleValue;

    drawGrid();
    draw();
})