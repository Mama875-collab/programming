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
