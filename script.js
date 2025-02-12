const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const snake = [{ x: 400, y: 300 }];
let snakeLength = 1;
let food = {};
let dx = 10;
let dy = 0;
let gameOver = false;
let score = 0;
let partiesCount = 0;

function createFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / 10)) * 10,
        y: Math.floor(Math.random() * (canvas.height / 10)) * 10
    };
}

function drawSnake() {
    ctx.fillStyle = "green";
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, 10, 10);
    });
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 10, 10);
}

function update() {
    if (gameOver) {
        return;
    }

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (head.x === food.x && head.y === food.y) {
        snakeLength++;
        score++;
        document.getElementById('score').innerText = "Score : " + score;
        createFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        endGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();

    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over!", canvas.width / 2 - 70, canvas.height / 2);
        return;
    }
    update();
}

function changeDirection(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (dy === 0) {
                dx = 0; dy = -10;
            }
            break;
        case 'ArrowDown':
            if (dy === 0) {
                dx = 0; dy = 10;
            }
            break;
        case 'ArrowLeft':
            if (dx === 0) {
                dx = -10; dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx === 0) {
                dx = 10; dy = 0;
            }
            break;
    }
}

function endGame() {
    gameOver = true;
    partiesCount++;
    document.getElementById('partiesCount').innerText = "Nombre de parties : " + partiesCount;

    // Réinitialisation de la partie
    setTimeout(() => {
        resetGame();
    }, 3000); // Nouvelle partie après 3 secondes
}

function resetGame() {
    snake.length = 0;
    snake.push({ x: 400, y: 300 });
    snakeLength = 1;
    score = 0;
    gameOver = false;
    document.getElementById('score').innerText = "Score : " + score;
    createFood();
}

// Code pour afficher le jeu lorsque l'utilisateur clique sur le bouton
document.getElementById('showGameButton').addEventListener('click', function() {
    document.getElementById('gameContainer').style.display = 'block';
    document.getElementById('gameCanvas').style.display = 'block';
    setInterval(draw, 100);
    createFood();
});

document.addEventListener('keydown', changeDirection);
