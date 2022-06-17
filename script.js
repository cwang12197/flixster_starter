const API_KEY = "api_key=0c34e535f3fa44f19963cddee5cf2d8d";
const API_URL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&" + API_KEY;
const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?${API_KEY}&query=`;

let page = 1;
const limit = 9;
var searchTerm = "";

const searchBarEl = document.querySelector("#search-input");
const searchInput = document.querySelector("#search");
const moviesGrid = document.querySelector("#movies-grid");
const loadButton = document.querySelector("#load-more-movies-btn");
const movieCardElements = document.querySelector(".movie-card");
const loadMoreMovies = document.querySelector("#load-more-movies-btn");
const closeButton = document.querySelector("#close-button");


console.log(API_URL);

async function populateInitial() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?${API_KEY}&language=en-US&page=1`);
    const result = await response.json();
    displayMovies(result);
}

async function getMovies(search, page) {
    console.log("search: ", search);
    const response = await fetch(`${SEARCH_URL}${search}&page=${page}&include_adult=false`);
    const results = await response.json();
    console.log(results.results);
    displayMovies(results);
}

function displayMovies(data) {
    moviesGrid.innerHTML = "";
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
            `<div class = "movie-card">
            <img class = "movie-poster" src = "https://image.tmdb.org/t/p/w500/${result.poster_path}" alt = "${result.title}" />
            <div class="movie-info">
            <h3>${result.title}</h3>
            <span class = ${color}>${result.vote_average}<span>
            </div>
            <div class = "overview"> ${result.overview}</div>
            </div>
    `
    })
}

window.onload = function () {
    populateInitial();
}

searchBarEl.addEventListener('submit', event => {
    event.preventDefault();
    loadMoreMovies.classList.remove("hidden");
    closeButton.classList.remove("hidden");

    moviesGrid.innerHTML = "";
    page = 1;
    searchTerm = searchInput.value;
    console.log(searchTerm); 
    getMovies(searchTerm, page);
})

loadMoreMovies.addEventListener('click', event => {
    page += 1;
    moviesGrid.innerHTML += getMovies(searchTerm, page);
})


closeButton.addEventListener("click", event => {
    window.location.reload();
})

//TODO: load more clears the page, clear search is not working