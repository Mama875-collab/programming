const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

canvas.width = 800;
canvas.height = 600;

const bacteriaImage = new Image();
bacteriaImage.src = 'bac.png'; // Assurez-vous que bac.png est dans le même dossier que ce fichier

let bacteria = [];
let simulationRunning = false;

class Bacteria {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 20; // Initial size of the bacteria
    }

    draw() {
        ctx.drawImage(bacteriaImage, this.x, this.y, this.size, this.size);
    }

    update() {
        // Simple random movement
        this.x += (Math.random() - 0.5) * 2;
        this.y += (Math.random() - 0.5) * 2;

        // Keep the bacteria within the canvas bounds
        if (this.x < 0) this.x = 0;
        if (this.x > canvas.width - this.size) this.x = canvas.width - this.size;
        if (this.y < 0) this.y = 0;
        if (this.y > canvas.height - this.size) this.y = canvas.height - this.size;
    }
}

function createBacteria() {
    // Create new bacteria at random positions
    const x = Math.random() * (canvas.width - 20);
    const y = Math.random() * (canvas.height - 20);
    bacteria.push(new Bacteria(x, y));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bacteria.forEach(bac => {
        bac.update();
        bac.draw();
    });
}

function loop() {
    if (simulationRunning) {
        draw();
        requestAnimationFrame(loop);
    }
}

// Lancer la simulation
startButton.addEventListener('click', () => {
    bacteria = [];
    for (let i = 0; i < 20; i++) { // Create 20 initial bacteria
        createBacteria();
    }
    simulationRunning = true;
    loop();
    startButton.style.display = 'none';
    restartButton.style.display = 'block';
});

// Recommencer la simulation
restartButton.addEventListener('click', () => {
    bacteria = [];
    for (let i = 0; i < 20; i++) {
        createBacteria();
    }
    simulationRunning = true;
    loop();
});

// Stop the simulation or cleanup as needed
function stopSimulation() {
    simulationRunning = false;
    restartButton.style.display = 'none';
    startButton.style.display = 'block';
}
