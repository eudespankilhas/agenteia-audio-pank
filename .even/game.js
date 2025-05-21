// Configuração inicial do jogo
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const scoreElement = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    { x: 10, y: 10 }
];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameRunning = false;
let gameLoop;

// Funções de controle do jogo
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        startBtn.style.display = 'none';
        restartBtn.style.display = 'block';
        gameLoop = setInterval(update, 100);
    }
}

function restartGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
}

// Controles de teclado
document.addEventListener('keydown', (event) => {
    if (!gameRunning) return;

    switch (event.key) {
        case 'ArrowUp':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
    }
});

// Funções de atualização do jogo
function update() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Verificar colisão com as paredes
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Verificar colisão com o próprio corpo
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // Verificar se comeu a comida
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
    } else {
        snake.pop();
    }

    draw();
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // Evitar gerar comida sobre a cobra
    for (let segment of snake) {
        if (food.x === segment.x && food.y === segment.y) {
            generateFood();
            break;
        }
    }
}

function gameOver() {
    clearInterval(gameLoop);
    gameRunning = false;
    startBtn.style.display = 'block';
    restartBtn.style.display = 'block';
    alert('Game Over! Pontuação: ' + score);
}

// Funções de renderização
function draw() {
    // Limpar o canvas
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar a cobra
    ctx.fillStyle = '#2ecc71';
    for (let segment of snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }

    // Desenhar a comida
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// Event listeners dos botões
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', () => {
    restartGame();
    startGame();
});

// Desenho inicial
draw();