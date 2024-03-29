var main = document.getElementById("movie_content_wrapper");
var header = document.getElementsByTagName("header")[0];
var nav = document.getElementsByTagName("nav")[0];
var media_type = location.search.slice(location.search.search("media_type") + 11, location.length);
var movie_id = location.search.slice(4, location.search.search("media_type") - 1);
var main_content_head = document.getElementById("movie_content_head_wrapper");
var title = document.getElementsByTagName("title")[0];
var detailsModule = document.getElementById("details_module_wrapper");

var windowPosition = window.pageYOffset;
window.addEventListener('scroll', scrollingEffect);
function scrollingEffect() {
    let scrollPosition = window.pageYOffset;
    if (scrollPosition > windowPosition) {
        header.classList.remove("showed_header");
        header.classList.add("closed_header");
    };

    if (scrollPosition <= windowPosition) {
        header.classList.remove("closed_header");
        header.classList.add("showed_header");
    };
    windowPosition = scrollPosition;
};

fetchAPI(`${media_type}/${movie_id}`, "movie");
fetchAPI(`${media_type}/${movie_id}/credits`, "cast");
fetchAPI(`${media_type}/${movie_id}/videos`, "posters");

console.log(`${media_type}/${movie_id}`);

async function fetchAPI(url, type) {
    await fetch(`https://api.themoviedb.org/3/${url}?api_key=d14b1adbe04d8ccc380f0580684188f5&language=en-US`)
    .then(res => res.json())
    .then(obj => {
        if (type == "movie") {
            showMovieContent(obj);
        };
        if (type == "cast") {
            showCast(obj.cast);
        };
        if (type == "posters") {
            console.log(obj);
        };
    });
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

function getRunTimeOfMovie(minutes) {
    minutes = +minutes;
    let result = "";
    let hours = Math.trunc(minutes / 60);
    if (hours == 0) {
        result = `м${minutes}`;
    } else {
        result = `ч${Math.trunc(minutes / 60)} м${(minutes % 60)}`;
    }
    return result;
}

function getOverview(overview) {
    if (overview != "") {
        return overview;
    } else {
        return `Нет обзора, переведённого на русский язык. Помогите расширить базу данных, добавив его.`
    }
}

function getProdutionCountry(arr) {
    if (arr.length != 0) {
        return arr[0].iso_3166_1.toUpperCase();
    } else {
        return "MX";
    }
}

function showCast(arr) {
    var cast_list_wrapper = document.getElementById("cast_wrapper");
    arr.forEach(cast => {
        if (cast.profile_path) {
            cast_list_wrapper.innerHTML += `
            <div class="cast_card_wrapper">
                <div class="cast_img_wrapper">
                    <div style="background-image: url(https://www.themoviedb.org/t/p/w138_and_h175_face${cast.profile_path});" class="cast_img">
                </div>
                <div class="cast_info_wrapper">
                    <span class="cast_name">${cast.name ?? cast.original_name}</span>
                    <span class="cast_original_name">${cast.character}</span>
                    <!-- <span class="cast_episodes">9 эпизодов</span> -->
                </div>
            </div>
            `
        } else {
            cast_list_wrapper.innerHTML += `
            <div class="cast_card_wrapper">
                <div class="cast_img_wrapper without_img">
                    <div style="background-image: url(https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-36-user-female-grey-d9222f16ec16a33ed5e2c9bbdca07a4c48db14008bbebbabced8f8ed1fa2ad59.svg);" class="anonymus_icon">
                </div>
                <div class="cast_info_wrapper">
                    <span class="cast_name">${cast.name ?? cast.original_name}</span>
                    <span class="cast_original_name">${cast.character}</span>
                    <!-- <span class="cast_episodes">9 эпизодов</span> -->
                </div>
            </div>
            `
        }
    })
}

function showMovieContent(movie) {
    // console.log(movie);
    var movie_release_date = (movie.release_date ?? movie.first_air_date).slice(0, 4)
    var movie_name = movie.name ?? movie.title ?? movie.original_title ?? movie.original_title;
    title.innerHTML = `${movie_name} (${movie_release_date}) — The Movie Database (TMDB)`
    main_content_head.innerHTML = `
        <div class="movie_content_head_wrapper" style="background-image: url(https://www.themoviedb.org/t/p/original${movie.backdrop_path});">
        <div class="movie_content_head">
            <div class="movie_img_wrapper">
                <img src="https://www.themoviedb.org/t/p/original${movie.poster_path}" class="movie_img">
                <div onclick="detailModule(\`show\`, \`posters\`)" class="img_info_link">
                    <img class="fullscreen_icon" src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-216-fullscreen-white-87524788011715a9bd73de86ef577442070ebc9873a7abb2845a6310a7f6174a.svg">
                    Расширить
                </div>
            </div>
            <div class="about_movie_wrapper">
                <div class="movie_title_wrapper">
                    <div class="movie_title">
                        <span class="movie_title_text">${movie_name}</span>
                        <span class="movie_release_year">(${movie_release_date})</span>
                    </div>
                    <div class="title_info_wrapper">
                        <span class="version_btn">PG-13</span>
                        <span class="title_release_date">${(movie.release_date ?? movie.first_air_date).split("-").join("/")} (${getProdutionCountry(movie.production_countries)})</span>
                        <span class="title_genres">${showGenres(movie.genres)}</span>
                        <span class="title_time">${getRunTimeOfMovie(movie.runtime ?? movie.episode_run_time[0])}</span>
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
                        <a class="movie_trailer_link">Play Trailer</a>
                    </div>
                    <div class="movie_overview_wrapper">
                        <span class="movie_part_text">${movie.tagline}</span>
                        <div class="movie_overview">
                            <span class="overview_title">Overwiew</span>
                            <div class="overview">
                                ${getOverview(movie.overview)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    `;
}

function detailModule(status, module_type) {
    if (status == "show" && detailsModule.className.toLowerCase().includes("closed")) {
        detailsModule.classList.remove("closed");
        nav.classList.add("module_active");
        header.classList.add("module_active");
        main.classList.add("module_active");
    };
    if (status == "close" && !detailsModule.className.toLowerCase().includes("closed")) {
        detailsModule.classList.add("closed");
        nav.classList.remove("module_active");
        header.classList.remove("module_active");
        main.classList.remove("module_active");
    };
};