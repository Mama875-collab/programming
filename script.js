const apiKey = 'AIzaSyDI8jV1kbuyL8KyBYfR09SMadLrSIDRh-E'; // Remplacez par votre clé API YouTube
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const videoContainer = document.getElementById('video-container');
const results = document.getElementById('results');
const toggleSearchButton = document.getElementById('toggle-search-button');
const searchContainer = document.getElementById('search-container');

// Montrer ou cacher la zone de recherche
toggleSearchButton.addEventListener('click', () => {
    if (searchContainer.style.display === 'none') {
        searchContainer.style.display = 'block';
        toggleSearchButton.innerText = "Cacher les informations";
        results.style.display = 'none'; // Masquer les résultats au début
    } else {
        searchContainer.style.display = 'none';
        toggleSearchButton.innerText = "En savoir plus";
        results.innerHTML = ''; // Vider les résultats précédents
        results.style.display = 'none'; // Masquer les résultats
        videoContainer.innerHTML = ''; // Vider la vidéo précédente
    }
});

// Rechercher des vidéos sur YouTube lorsque l'utilisateur clique sur "Chercher"
searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    if (!query) return;

    fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${query}&part=snippet&type=video`)
        .then(response => response.json())
        .then(data => {
            displayResults(data.items);
        })
        .catch(error => console.error('Erreur:', error));
});

// Afficher les résultats de recherche
function displayResults(videoItems) {
    results.innerHTML = ''; // Vider les résultats précédents
    if (videoItems.length === 0) {
        results.innerHTML = `<div>Aucun résultat trouvé.</div>`;
        results.style.display = 'block'; // Afficher les résultats même si vides
        return;
    }

    videoItems.forEach(item => {
        const videoId = item.id.videoId;
        const title = item.snippet.title;

        const resultDiv = document.createElement('div');
        resultDiv.classList.add('result');
        resultDiv.innerHTML = `<h3>${title}</h3>`;
        resultDiv.onclick = () => {
            loadVideo(videoId);
        };
        results.appendChild(resultDiv);
    });
    results.style.display = 'block'; // Afficher les résultats
}

// Charger la vidéo sélectionnée
function loadVideo(videoId) {
    videoContainer.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
    `;
}
