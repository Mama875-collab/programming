const canvas = document.getElementById('bacteriaCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const populationLabel = document.getElementById('populationLabel');

const BACTERIA_IMAGE = new Image();
BACTERIA_IMAGE.src = 'bac.png'; // Chemin vers votre image

const INITIAL_BACTERIA_COUNT = 20;
const DUPLICATION_INTERVAL = 100; // Millisecondes

let bacteria = [];
let populationSize = INITIAL_BACTERIA_COUNT;
let intervalId;
let duplicationIntervalId;

class Bacteria {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    move() {
        this.x += Math.floor(Math.random() * 3) - 1; // Déplacer -1, 0 ou 1
        this.y += Math.floor(Math.random() * 3) - 1;

        // Vérifier les limites du canvas
        if (this.x < 0) this.x = 0;
        if (this.x > canvas.width - BACTERIA_IMAGE.width) this.x = canvas.width - BACTERIA_IMAGE.width;
        if (this.y < 0) this.y = 0;
        if (this.y > canvas.height - BACTERIA_IMAGE.height) this.y = canvas.height - BACTERIA_IMAGE.height;
    }
}

function drawBacteria() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bacteria.forEach(bac => {
        ctx.drawImage(BACTERIA_IMAGE, bac.x, bac.y); // Dessiner l'image de la bactérie
    });
}

function updatePopulation() {
    if (bacteria.length) {
        const newBacteria = new Bacteria(
            Math.floor(Math.random() * canvas.width),
            Math.floor(Math.random() * canvas.height)
        );
        bacteria.push(newBacteria);
        populationSize++;
        populationLabel.textContent = `Population: ${populationSize}`;
    }
}

function resetSimulation() {
    clearInterval(intervalId);
    clearInterval(duplicationIntervalId);
    bacteria = [];
    populationSize = INITIAL_BACTERIA_COUNT;

    for (let i = 0; i < INITIAL_BACTERIA_COUNT; i++) {
        bacteria.push(new Bacteria(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)));
    }

    populationLabel.textContent = `Population: ${populationSize}`;
    drawBacteria();
}

function startSimulation() {
    resetSimulation();
    startButton.disabled = true;
    resetButton.disabled = false;

    intervalId = setInterval(() => {
        bacteria.forEach(bac => bac.move());
        drawBacteria();
    }, 100); // Mise à jour de la position des bactéries !

    duplicationIntervalId = setInterval(updatePopulation, DUPLICATION_INTERVAL); // Duplication des bactéries toutes les secondes
}

// Événements de clic sur les boutons
startButton.addEventListener('click', startSimulation);
resetButton.addEventListener('click', resetSimulation);

// Lancer la simulation initiale pour peupler le canevas
resetSimulation();
