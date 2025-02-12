const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let partiesCount = 0;
let gameRunning = false;
let enemies = [];

function startGame() {
    gameRunning = true;
    score = 0;
    enemies = [];
    document.getElementById('score').innerText = "Score : " + score;
    document.getElementById('partiesCount').innerText = "Nombre de parties : " + partiesCount;
    document.getElementById('gameContainer').style.display = 'block';
    document.getElementById('gameCanvas').style.display = 'block';
    
    spawnEnemy();
    gameLoop();
}

function endGame() {
    gameRunning = false;
    partiesCount++;
    document.getElementById('partiesCount').innerText = "Nombre de parties : " + partiesCount;
    alert("Fin du jeu ! Votre score : " + score);
}

function spawnEnemy() {
    if (!gameRunning) return;

    const enemy = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: 40,
        height: 40
    };
    enemies.push(enemy);

    setTimeout(spawnEnemy, 2000); // Nouvelle vague d'ennemis toutes les 2 secondes
}

function drawEnemies() {
    ctx.fillStyle = 'red';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawEnemies();
    
    // Conditionally end game for demonstration
    if (score >= 10) {
        endGame();
    }

    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', function(event) {
    if (!gameRunning) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        if (mouseX >= enemy.x && mouseX <= enemy.x + enemy.width && mouseY >= enemy.y && mouseY <= enemy.y + enemy.height) {
            enemies.splice(i, 1); // Remove enemy
            score++;
            document.getElementById('score').innerText = "Score : " + score;
            break;
        }
    }
});

// Code pour démarrer le jeu lorsque l'utilisateur clique sur un bouton
document.getElementById('showGameButton').style.display = 'block';
document.getElementById('showGameButton').addEventListener('click', startGame);
