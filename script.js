const API_KEY = "api_key=0c34e535f3fa44f19963cddee5cf2d8d";
const API_URL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&" + API_KEY;
const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?${API_KEY}&query=`;
const YT_LINK = "https://www.youtube.com/embed/";
let page = 1;
var searchTerm = "";

const searchBarEl = document.querySelector("#search-input");
const searchInput = document.querySelector("#search");
const moviesGrid = document.querySelector("#movies-grid");
const moviePoster = document.querySelector(".movie-poster");
const loadButton = document.querySelector("#load-more-movies-btn");
const movieCardElements = document.querySelector(".movie-card");
const loadMoreMovies = document.querySelector("#load-more-movies-btn");
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content")
const youtubeVideo = document.querySelector("#youtubeVideo")
const modalRemove = document.querySelector(".modal")

async function loadInitial() {
    let response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?${API_KEY}&language=en-US&page=1`);
    let result = await response.json();
    displayMovies(result);
}
console.log(API_URL);

async function getMovies(search, page) {
    
    let response = await fetch(`${SEARCH_URL}${search}&page=${page}&include_adult=false`);
    let results = await response.json();
    
    displayMovies(results);
}

function displayMovies(data) {
    console.log('data: ', data);
    const resultData = data.results;
    let color = "red";

    resultData.forEach(result => {
        if (result.vote_average > 6.5) {
            color = "green";
        }
        else if (result.vote_average > 3.5) {
            color = "yellow";
        }
        moviesGrid.innerHTML +=
            `<div class = "movie-card" id = "movie-card-${result.id}">
            <img class = "movie-poster" id = "movie-poster-${result.id}" src = "https://image.tmdb.org/t/p/w500/${result.poster_path}" alt = "${result.title}" />
            <div class="movie-info">
            <h3>${result.title}</h3>
            <span class = ${color}>${result.vote_average}⭐<span>
            </div>
            <div class = "overview"> ${result.overview}</div>
            </div>
    `
        const movieCardEl = document.querySelector(`#movie-poster-${338953}`)
        console.log(movieCardEl)
    })
    const movieList = document.querySelectorAll(".movie-poster");
    movieList.forEach(movie => {
        movie.addEventListener("click", (event) => {
            getModal(event.target.id.split("-")[2])
        })
    })
}

window.onload = function () {
    moviesGrid.innerHTML = "";
    loadInitial();
    closeModal();
}

searchBarEl.addEventListener('submit', event => {
    event.preventDefault();
    loadMoreMovies.classList.remove("hidden");
    closeButton.classList.remove("hidden");

    moviesGrid.innerHTML = "";
    page = 1;
    searchTerm = searchInput.value;
     
    getMovies(searchTerm, page);
})

loadMoreMovies.addEventListener('click', event => {
    page += 1;
    // moviesGrid.innerHTML += `${getMovies(searchTerm, page)}`;
    getMovies(searchTerm, page)
})


closeButton.addEventListener("click", event => {
    window.location.reload();
})

function getModal(movieId) {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?${API_KEY}&language=en-US`).then((response) => {
        if (!response.ok) throw new Error("respo not okay");
        return response.json();
    }).then((data) => {
        const videos = data.results.filter((video) => {
            return video.site == ("YouTube") && video.type == "Trailer";
        })
        if (videos.length == 0) {
            return;
        }
        console.log(videos);
        youtubeVideo.src = `${YT_LINK}${videos[0].key}`
        modalRemove.classList.remove("hidden")
    });
}

function closeModal() {
    const closeButton = document.querySelector(".modal-content")
    closeButton.addEventListener("click", event => {
        modalRemove.classList.add("hidden")
        console.log("text modal close")
    })
}

