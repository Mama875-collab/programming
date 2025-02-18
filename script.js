// Remplacez par vos vraies clés API et votre configuration Firebase
// Import the functions you need from the SDKs you need (Pas besoin avec CDN)
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDN9yTsDqCqGZs4SAH3UuydvlWn_Ov902g",
    authDomain: "programme-b0849.firebaseapp.com",
    projectId: "programme-b0849",
    storageBucket: "programme-b0849.firebasestorage.app",
    messagingSenderId: "622151454923",
    appId: "1:622151454923:web:1596678d91eb7c55f0cb4e",
    measurementId: "G-5JT8HPFZDH"
};

// Initialize Firebase (Utiliser firebase.initializeApp pour la compatibilité CDN)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();  //  <-- Ajouter cette ligne pour initialiser auth
// const analytics = getAnalytics(app);   //  Pas nécessaire avec le code actuel

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
let seconds = 0;
let minutes = 0;
let hours = 0;
let days = 0;

// ** IMPORTANT: Définir les clés API ICI.  Remplacez par VOS vraies clés!**
const googleApiKey = "AIzaSyA4eqqy9F8KpaLwq2LRuqF8CpoIIr04u6s";
const youtubeApiKey = "AIzaSyDI8jV1kbuyL8KyBYfR09SMadLrSIDRh-E";


// --  Fonctions pour la gestion du compte utilisateur avec Firebase Auth --
function signup() {
    const email = usernameInput.value; // Utilisez username comme email pour l'exemple
    const password = passwordInput.value;

    if (!email || !password) {
        alert('Veuillez entrer un email et un mot de passe.');
        return;
    }

    if (!email.includes('@')) { // Validation d'email simple
        alert('Veuillez entrer une adresse email valide.');
        return;
    }

    if (password.length < 6) {
        alert('Le mot de passe doit comporter au moins 6 caractères.');
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Utilisateur créé
            const user = userCredential.user;
            alert('Inscription réussie.');
            // Vous pouvez ici mettre à jour l'interface utilisateur
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            let alertMessage = `Erreur lors de l'inscription: ${errorCode} - ${errorMessage}`;

            // Afficher des erreurs plus spécifiques
            if (errorCode === 'auth/email-already-in-use') {
                alertMessage = 'Cet email est déjà utilisé. Veuillez en choisir un autre.';
            } else if (errorCode === 'auth/weak-password') {
                alertMessage = 'Le mot de passe est trop faible. Il doit comporter au moins 6 caractères.';
            }
            alert(alertMessage);
            // ... gérer l'erreur (par exemple, afficher un message à l'utilisateur) ...
        });
}

function login() {
    const email = usernameInput.value; // Utilisez username comme email pour l'exemple
    const password = passwordInput.value;

    if (!email || !password) {
        alert('Veuillez entrer un email et un mot de passe.');
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            alert('Connexion réussie.');
            updateUserInterface(user.email); // Mettez à jour l'interface utilisateur
            startTimer();
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            let alertMessage = `Erreur lors de la connexion: ${errorCode} - ${errorMessage}`;

             // Afficher des erreurs plus spécifiques
             if (errorCode === 'auth/user-not-found') {
                alertMessage = 'Aucun utilisateur trouvé avec cet email.';
            } else if (errorCode === 'auth/wrong-password') {
                alertMessage = 'Mot de passe incorrect.';
            } else if (errorCode === 'auth/invalid-email') {
                 alertMessage = 'Adresse email invalide.';
             }

            alert(alertMessage);
        });
}

function logout() {
    firebase.auth().signOut().then(() => {
        // Déconnexion réussie
        alert('Déconnexion réussie.');
        updateUserInterface(); // Mettre à jour l'interface utilisateur
        stopTimer();
    }).catch((error) => {
        // Une erreur s'est produite
        console.error("Erreur de déconnexion :", error);
        alert("Erreur lors de la déconnexion.");
    });
}

// --  Gestion de l'état d'authentification  --
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // L'utilisateur est connecté
        updateUserInterface(user.email); // Mettre à jour l'interface utilisateur
        startTimer(); // Démarrer le timer
    } else {
        // L'utilisateur est déconnecté
        updateUserInterface(); // Mettre à jour l'interface utilisateur
        stopTimer(); // Arrêter le timer
    }
});

function updateUserInterface(email) {
    if (email) {
        // Utilisateur connecté
        loginForm.style.display = 'none';
        userInfo.style.display = 'block';
        userDisplayName.textContent = email; // Affiche l'email
    } else {
        // Utilisateur non connecté
        loginForm.style.display = 'block';
        userInfo.style.display = 'none';
        usernameInput.value = '';
        passwordInput.value = '';
    }
}

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
    if (!googleApiKey) {
        alert("Clé API Google manquante.  Veuillez définir googleApiKey.");
        return;
    }

    fetch(`https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=00746c2a86b294cd0&q=${query}`)
        .then(response => response.json())
        .then(data => displayGoogleResults(data.items))
        .catch(error => console.error('Erreur Google:', error));
}

// Fonction pour rechercher sur YouTube
function searchYouTube(query) {
     if (!youtubeApiKey) {
        alert("Clé API YouTube manquante.  Veuillez définir youtubeApiKey.");
        return;
    }

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

function startTimer() {
    startTime = Date.now();
    seconds = 0;
    minutes = 0;
    hours = 0;
    days = 0;

    if (intervalId) {
        clearInterval(intervalId); // Arrêter l'intervalle précédent si existant
    }

    intervalId = setInterval(updateTimer, 1000);
}

function updateTimer() {
    seconds++;

    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
            if (hours >= 24) {
                hours = 0;
                days++;
            }
        }
    }

    timeSpentDisplay.textContent = `${days}j ${hours}h ${minutes}m ${seconds}s`;
}

function stopTimer() {
    clearInterval(intervalId);
    seconds = 0;
    minutes = 0;
    hours = 0;
    days = 0;
    timeSpentDisplay.textContent = '0s'; // Réinitialiser l'affichage
}
