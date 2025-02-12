const apiKey = 'AIzaSyDI8jV1kbuyL8KyBYfR09SMadLrSIDRh-E'; // Remplacez par votre clé API YouTube
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const videoContainer = document.getElementById('video-container');
const results = document.getElementById('results');

// Fonction pour rendre la vidéo déplaçable
function makeDraggable(element) {
    let offsetX, offsetY;

    element.onmousedown = (e) => {
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        document.onmousemove = (e) => {
            element.style.left = (e.clientX - offsetX) + 'px';
            element.style.top = (e.clientY - offsetY) + 'px';
            element.style.position = 'absolute';
        };
        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
}

// Rechercher des vidéos sur YouTube
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
}

// Charger la vidéo sélectionnée
function loadVideo(videoId) {
    videoContainer.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
    `;
    makeDraggable(videoContainer); // Rendre la vidéo déplaçable
}
