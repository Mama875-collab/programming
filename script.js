const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let score = 0;
let targets = [];
let gameActive = false;
let targetInterval = null;

const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score');
const gameOverlay = document.querySelector('.game-overlay');

// Création de cibles
function createTarget() {
    const targetSize = 30;
    const target = {
        x: Math.random() * (canvas.width - targetSize),
        y: Math.random() * (canvas.height - targetSize),
        size: targetSize,
    };

    targets.push(target);
}

// Dessiner les cibles
function drawTargets() {
    targets.forEach(target => {
        ctx.fillStyle = 'red';
        ctx.fillRect(target.x, target.y, target.size, target.size);
    });
}

// Mise à jour du score
function updateScore() {
    scoreDisplay.innerText = `Score : ${score}`;
}

// Démarrer le jeu
function startGame() {
    gameActive = true;
    targetInterval = setInterval(createTarget, 1000);
    gameLoop();
}

// Boucle de jeu
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTargets();
    requestAnimationFrame(gameLoop);
}

// Événement clic
canvas.addEventListener('click', function(event) {
    if (!gameActive) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    targets.forEach((target, index) => {
        if (
            mouseX >= target.x &&
            mouseX <= target.x + target.size &&
            mouseY >= target.y &&
            mouseY <= target.y + target.size
        ) {
            // Vérifier si la cible a été touchée
            targets.splice(index, 1); // Supprimer la cible
            score++;
            updateScore();
        }
    });
});

// Événement clic sur le bouton de démarrage
startButton.addEventListener('click', function() {
    gameOverlay.style.display = 'none';
    startGame();
});
