var media_type = location.search.slice(location.search.search("media_type") + 11, location.length);
var movie_id = location.search.slice(4, location.search.search("media_type") - 1);
var main = document.getElementById("movie_content_wrapper");

fetchAPI();

async function fetchAPI() {
    await fetch(`https://api.themoviedb.org/3/${media_type}/${movie_id}?api_key=d14b1adbe04d8ccc380f0580684188f5&language=ru-RU`)
    .then(res => res.json())
    .then(obj => showMovieContent(obj));
};

function getPercentColor(percent) {
    if (percent >= 70) {
        return "#21d07a";
    } else if (percent <= 30) {
        return "#db2360";
    } else if (percent < 70) {
        return "#d2d531";
    };
};

function showGenres(array) {
    var result = ``;
    array.forEach(genre => {
        result += genre.name + ", ";
    });
    return result.slice(0, result.length - 2);
}

console.log((103 / 10) * 2);

function getGradient(img) {
    var canvas = document.createElement("canvas");
    var c = canvas.getContext('2d');
    c.width = canvas.width = img.width;
    c.height = canvas.height = img.height;
    c.clearRect(0, 0, c.width, c.height);
    c.drawImage(img, 0, 0, img.width , img.height);
    return c;
}

function showMovieContent(movie) {
    console.log(movie);
    console.log(`<div class="movie_content_head_wrapper" style="background-image: url(https://www.themoviedb.org/t/p/original${movie.backdrop_path});">`);
    main.innerHTML = `
        <div class="movie_content_head_wrapper" style="background-image: url(https://www.themoviedb.org/t/p/original${movie.backdrop_path});">
        <div class="movie_content_head">
            <div class="movie_img_wrapper">
                <img src="https://www.themoviedb.org/t/p/original${movie.poster_path}" class="movie_img">
            </div>
            <div class="about_movie_wrapper">
                <div class="movie_title_wrapper">
                    <div class="movie_title">
                        <span class="movie_title_text">${movie.name ?? movie.title ?? movie.title ?? movie.original_title ?? movie.original_title}</span>
                        <span class="movie_release_year">(2022)</span>
                    </div>
                    <div class="title_info_wrapper">
                        <span class="version_btn">PG-13</span>
                        <span class="title_release_date">${(movie.release_date ?? movie.first_air_date).split("-").join("/")} (${movie.production_countries[0].iso_3166_1.toUpperCase()})</span>
                        <span class="title_genres">${showGenres(movie.genres)}</span>
                        <span class="title_time">2h 41m</span>
                    </div>
                </div>
                <div class="movie_content_info_wrapper">
                    <div class="movie_estimation_wrapper">
                        <div class="movie_rating_wrapper">
                            <div class="popularity_wrapper">
                                <div class="popularity">
                                    <svg viewBox="0 0 36 36" class="circular-chart">
                                        <path class="circle" stroke-dasharray="${+((movie.vote_average.toFixed(1)).split(".").join(""))}, 100" style="stroke: ${getPercentColor(+((movie.vote_average.toFixed(1)).split(".").join("")))};"
                                            d="M18 2.0845
                                              a 15.9155 15.9155 0 0 1 0 31.831
                                              a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                    <div class="popularity_percent">
                                        ${+((movie.vote_average.toFixed(1)).split(".").join(""))}
                                    </div>
                                </div>
                            </div>
                            <span class="movie_rating_title">Рейтинг</span>
                        </div>
                        <div class="movie_options_wrapper">
                            <div class="movie_option">
                                <img src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-159-thumbnails-list-white-c260ea972eebf812289fd3c41d0d2c1dff33ecbcd62be13fba8eeaf9de173789.svg" class="option_icon">
                                <div class="option_tooltip">
                                    <span class="tooltip_text">Добавить в список</span>
                                </div>
                            </div>
                            <div class="movie_option">
                                <img src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-13-heart-white-28d2cc2d6418c5047efcfd2438bfc5d109192671263c270993c05f130cc4584e.svg" class="option_icon">
                                <div class="option_tooltip">
                                    <span class="tooltip_text">Добавить в Избранное</span>
                                </div>
                            </div>
                            <div class="movie_option">
                                <img src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-73-bookmark-white-432e98d550b7e4c80b06272c49475b0db85a60f6fae450420713004b3c9d3ffd.svg" class="option_icon">
                                <div class="option_tooltip">
                                    <span class="tooltip_text">Добавить в список отслеживания</span>
                                </div>
                            </div>
                            <div class="movie_option">
                                <img src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-49-star-white-5c85220678b312aea9599d5f12ad858a9e7df226de51ef8b6b699023ffeda5fa.svg" class="option_icon">
                                <div class="option_tooltip">
                                    <span class="tooltip_text">Оценка 10.0</span>
                                </div>
                            </div>
                        </div>
                        <a class="movie_trailer_link">Воспроизвести трейлер</a>
                    </div>
                    <div class="movie_overview_wrapper">
                        <span class="movie_part_text">${movie.tagline}</span>
                        <div class="movie_overview">
                            <span class="overview_title">Обзор</span>
                            <div class="overview">
                                ${movie.overview}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    `;
}