const googleApiKey = 'AIzaSyA4eqqy9F8KpaLwq2LRuqF8CpoIIr04u6s'; // Remplacez par votre clé API Google
const youtubeApiKey = 'AIzaSyDI8jV1kbuyL8KyBYfR09SMadLrSIDRh-E'; // Remplacez par votre clé API YouTube

const googleSearchButton = document.getElementById('google-search-button');
const googleSearchInput = document.getElementById('google-search-input');
const googleResults = document.getElementById('google-results');

const youtubeSearchButton = document.getElementById('youtube-search-button');
const youtubeSearchInput = document.getElementById('youtube-search-input');
const youtubeResults = document.getElementById('youtube-results');

const videoContainer = document.getElementById('video-container');
const toggleSearchButton = document.getElementById('toggle-search-button');
const searchContainer = document.getElementById('search-container');

// --  Variables pour la gestion du compte utilisateur  --
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const logoutButton = document.getElementById('logout-button');
const userArea = document.getElementById('user-area');
const userInfo = document.getElementById('user-info');
const loginForm = document.getElementById('login-form');
const userDisplayName = document.getElementById('user-display-name');
const timeSpentDisplay = document.getElementById('time-spent');
let startTime = Date.now();
let intervalId;


// --  Fonctions pour la gestion du compte utilisateur  --
function login() {
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Récupérer les utilisateurs du localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Trouver l'utilisateur
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Connexion réussie
        localStorage.setItem('loggedInUser', JSON.stringify({ username: user.username })); // Sauvegarder l'utilisateur connecté
        updateUserInterface(user.username); // Mettre à jour l'interface
        startTimer(); // Démarre le timer après la connexion
    } else {
        alert('Nom d\'utilisateur ou mot de passe incorrect.');
    }
}

function signup() {
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (!username || !password) {
        alert('Veuillez entrer un nom d\'utilisateur et un mot de passe.');
        return;
    }

    // Récupérer les utilisateurs existants
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Vérifier si l'utilisateur existe déjà
    if (users.some(user => user.username === username)) {
        alert('Ce nom d\'utilisateur est déjà pris.');
        return;
    }

    // Ajouter le nouvel utilisateur
    users.push({ username, password }); // Enregistrez le mot de passe (dans un vrai système, jamais en clair !)
    localStorage.setItem('users', JSON.stringify(users));
    alert('Inscription réussie. Veuillez vous connecter.');
}

function logout() {
    localStorage.removeItem('loggedInUser'); // Supprimer l'utilisateur connecté
    updateUserInterface(); // Mettre à jour l'interface pour la déconnexion
    stopTimer(); // Arrête le timer lors de la déconnexion
    startTime = Date.now(); // Réinitialise le temps de départ
}


function updateUserInterface(username) {
    if (username) {
        // Utilisateur connecté
        loginForm.style.display = 'none';
        userInfo.style.display = 'block';
        userDisplayName.textContent = username;
    } else {
        // Utilisateur non connecté
        loginForm.style.display = 'block';
        userInfo.style.display = 'none';
        usernameInput.value = '';
        passwordInput.value = '';
    }
}

// Fonction pour démarrer le timer
function startTimer() {
    startTime = Date.now(); // Réinitialise le temps de départ
    intervalId = setInterval(() => {
        const now = Date.now();
        const timeSpentInSeconds = Math.floor((now - startTime) / 1000);
        timeSpentDisplay.textContent = timeSpentInSeconds;
    }, 1000); // Met à jour toutes les secondes
}

// Fonction pour arrêter le timer
function stopTimer() {
    clearInterval(intervalId);
}


// --  Gestion des événements pour le compte utilisateur  --
loginButton.addEventListener('click', login);
signupButton.addEventListener('click', signup);
logoutButton.addEventListener('click', logout);

// -- Initialisation : Vérifier si un utilisateur est déjà connecté au chargement de la page --
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        updateUserInterface(user.username);
        startTimer(); // Démarrer le timer si un utilisateur est connecté
    } else {
        updateUserInterface(); // Assurer que l'interface est correcte si personne n'est connecté
    }
});



// Montrer ou cacher la zone de recherche
toggleSearchButton.addEventListener('click', () => {
    if (searchContainer.style.display === 'none') {
        searchContainer.style.display = 'block';
        toggleSearchButton.innerText = "Cacher les informations";
    } else {
        searchContainer.style.display = 'none';
        toggleSearchButton.innerText = "En savoir plus";
        googleResults.style.display = 'none';
        youtubeResults.style.display = 'none';
        videoContainer.innerHTML = ''; // Efface la vidéo quand on cache la recherche
    }
});

// Rechercher via Google lorsque l'utilisateur clique sur "Rechercher Google"
googleSearchButton.addEventListener('click', () => {
    const query = googleSearchInput.value;
    if (!query) return;

    searchGoogle(query);
});

// Rechercher sur YouTube lorsque l'utilisateur clique sur "Rechercher YouTube"
youtubeSearchButton.addEventListener('click', () => {
    const query = youtubeSearchInput.value;
    if (!query) return;

    searchYouTube(query);
});

// Fonction pour rechercher sur Google
function searchGoogle(query) {
    fetch(`https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=00746c2a86b294cd0&q=${query}`)
        .then(response => response.json())
        .then(data => displayGoogleResults(data.items))
        .catch(error => console.error('Erreur Google:', error));
}

// Fonction pour rechercher sur YouTube
function searchYouTube(query) {
    // Ajoute le paramètre maxResults à l'URL de la requête
    fetch(`https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&q=${query}&part=snippet&type=video&maxResults=20`) // Modifie maxResults pour obtenir plus de résultats (ex: 20)
        .then(response => response.json())
        .then(data => displayYouTubeResults(data.items))
        .catch(error => console.error('Erreur YouTube:', error));
}

// Afficher les résultats de recherche Google
function displayGoogleResults(results) {
    googleResults.innerHTML = '';
    if (!results || results.length === 0) {
        googleResults.innerHTML = `<div>Aucun résultat Google trouvé.</div>`;
        googleResults.style.display = 'block';
        return;
    }

    results.forEach(item => {
        const title = item.title;
        const link = item.link;

        const resultDiv = document.createElement('div');
        resultDiv.classList.add('result');
        resultDiv.innerHTML = `
            <h3><a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a></h3>
        `;
        googleResults.appendChild(resultDiv);
    });
    googleResults.style.display = 'block';
}

// Afficher les résultats de recherche YouTube
function displayYouTubeResults(results) {
    youtubeResults.innerHTML = '';
    if (!results || results.length === 0) {
        youtubeResults.innerHTML = `<div>Aucun résultat YouTube trouvé.</div>`;
        youtubeResults.style.display = 'block';
        return;
    }

    results.forEach(item => {
        const title = item.snippet.title;
        const videoId = item.id.videoId;

        const resultDiv = document.createElement('div');
        resultDiv.classList.add('result');
        resultDiv.innerHTML = `<h3>${title}</h3>`;
        resultDiv.onclick = () => {
            loadVideo(videoId);
        };
        youtubeResults.appendChild(resultDiv);
    });
    youtubeResults.style.display = 'block';
}

// Charger la vidéo sélectionnée
function loadVideo(videoId) {
    videoContainer.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
    `;
}
