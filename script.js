const key = '48aa722f';
var searchInput = document.getElementById('Input');
var displaySearchList = document.getElementsByClassName('fav-container');
// Fetch a sample movie to test the API connection
fetch('https://www.omdbapi.com/?i=tt3896198&apikey=' + key)
    .then(res => res.json())
    .then(data => console.log(data));
// Upon keypress - function findMovies is initiated
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('Input');
    if (searchInput) {
        searchInput.addEventListener('input', findMovies);
    }
});
async function singleMovie() {
    var urlQueryParams = new URLSearchParams(window.location.search);
    var id = urlQueryParams.get('id');
    console.log(id);
    const url = `https://www.omdbapi.com/?i=${id}&apikey=${key}`;
    const res = await fetch(`${url}`);
    const data = await res.json();
    console.log(data);
    let releaseDate = data.Released !== 'N/A' ? data.Released : 'Release Date Not Available';
    let boxOffice = data.BoxOffice !== 'N/A' ? data.BoxOffice : 'Box Office Data Not Available';
    let trailerLink = `https://www.youtube.com/results?search_query=${encodeURIComponent(data.Title)}+trailer`;
    var output = `
    <div class="movie-poster">
        <img src=${data.Poster} alt="Movie Poster">
    </div>
    <div class="movie-details">
        <div class="details-header">
            <div class="dh-ls">
                <h2>${data.Title}</h2>
            </div>
            <div class="dh-rs">
                <i class="fa-solid fa-bookmark" onClick=addTofavorites('${id}') style="cursor: pointer;"></i>
            </div>
        </div>
        <span class="italics-text"><i>${data.Year} &#x2022; ${data.Country} &#x2022; Rating - <span
                    style="font-size: 18px; font-weight: 600;">${data.imdbRating}</span>/10 </i></span>
        <ul class="details-ul">
            <li><strong>Actors: </strong>${data.Actors}</li>
            <li><strong>Director: </strong>${data.Director}</li>
            <li><strong>Writers: </strong>${data.Writer}</li>
        </ul>
        <ul class="details-ul">
            <li><strong>Genre: </strong>${data.Genre}</li>
            <li><strong>Release Date: </strong>${releaseDate}</li>
            <li><strong>Box Office: </strong>${boxOffice}</li>
            <li><strong>Movie Runtime: </strong>${data.Runtime}</li>
        </ul>
        <p style="font-size: 14px; margin-top:10px;">${data.Plot}</p>
        <p style="font-size: 15px; font-style: italic;  margin-top: 10px;">
            <i class="fa-solid fa-award"></i>
            &thinsp; ${data.Awards}
        </p>
        <a href="${trailerLink}" target="_blank" style="color: #fff; border:2px solid white; font-size:14px; width:123px;padding:12px; font-weight: 600; white-space:nowrap;">Watch Trailer</a>
    </div>
    `;
    document.querySelector('.movie-container').innerHTML = output;
}
async function addTofavorites(id) {
    console.log("fav-item", id);
    localStorage.setItem(Math.random().toString(36).slice(2, 7), id);
    alert('Movie Added to Watchlist!');
}
async function removeFromfavorites(id) {
    console.log(id);
    for (i in localStorage) {
        if (localStorage[i] == id) {
            localStorage.removeItem(i);
            break;
        }
    }
    alert('Movie Removed from Watchlist');
    window.location.replace('favorite.html');
}
async function displayMovieList(movies) {
    var output = '';
    for (i of movies) {
        var img = i.Poster !== 'N/A' ? i.Poster : 'img/blank-poster.webp';
        var id = i.imdbID;
        output += `
        <div class="fav-item">
            <div class="fav-poster">
                <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
            </div>
            <div class="fav-details">
                <div class="fav-details-box">
                    <div>
                        <p class="fav-movie-name"><a href="movie.html?id=${id}">${i.Title}</a></p>
                        <p class="fav-movie-rating"><a href="movie.html?id=${id}">${i.Year}</a></p>
                    </div>
                    <div>
                        <i class="fa-solid fa-bookmark" style="cursor:pointer; color:#fff;" onClick=addTofavorites('${id}')></i>
                    </div>
                </div>
            </div>
        </div>
       `;
    }
    document.querySelector('.fav-container').innerHTML = output;
    console.log("Here is the movie list ..", movies);
}
async function findMovies() {
    const url = `https://www.omdbapi.com/?s=${(searchInput.value).trim()}&page=1&apikey=${key}`;
    const res = await fetch(`${url}`);
    const data = await res.json();
    const startExploringElement = document.querySelector('.start-exploring');
    if (data.Search) {
        displayMovieList(data.Search);
        if (startExploringElement) startExploringElement.style.display = 'none';
    } else {
        document.querySelector('.fav-container').innerHTML = `
            <div class="not-found">
                <img src="movie_not_found.png" alt="Movie Not Found" style="width: 100%; max-width: 300px;">
                <p style="color:#fff;">No movies found for your search.</p>
            </div>
        `;
        if (startExploringElement) startExploringElement.style.display = 'none';
    }
}
async function favoritesMovieLoader() {
    var output = '';
    for (i in localStorage) {
        var id = localStorage.getItem(i);
        if (id != null) {
            const url = `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${key}`;
            const res = await fetch(`${url}`);
            const data = await res.json();
            console.log(data);
            var img = data.Poster ? data.Poster : data.Title;
            var Id = data.imdbID;
            output += `
            <div class="fav-item">
                <div class="fav-poster">
                    <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
                </div>
                <div class="fav-details">
                    <div class="fav-details-box">
                        <div>
                            <p class="fav-movie-name">${data.Title}</p>
                            <p class="fav-movie-rating">${data.Year} &middot; <span
                                    style="font-size: 15px; font-weight: 600;">${data.imdbRating}</span>/10</p>
                        </div>
                        <div style="color: #fff">
                            <i class="fa-solid fa-trash" style="cursor:pointer;" onClick=removeFromfavorites('${Id}')></i>
                        </div>
                    </div>
                </div>
            </div>
           `;
        }
    }
    document.querySelector('.fav-container').innerHTML = output;
}