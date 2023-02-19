var filmsListWrapper = document.getElementsByClassName("films_list");
var main_api_url = "https://api.themoviedb.org/3";
var api_key = "d14b1adbe04d8ccc380f0580684188f5";
var images_url = "https://image.tmdb.org/t/p/original";
var header = document.getElementsByTagName("header")[0];
var img = document.getElementById("img");
// import {header, img} from "./html_varaibles.js";

// img.setAttribute("src", "https://www.themoviedb.org/t/p/w1920_and_h600_multi_faces_filter(duotone,00192f,00baff)/hPea3Qy5Gd6z4kJLUruBbwAH8Rm.jpg")

const FILTERS = {
    trending_this_day: "/trending/all/day?",
    trending_this_week: "/trending/all/week?",
    popular_on_theatres: "/movie/popular?",
    popular_on_tv: "/tv/popular?",
}

var listFilters = [
    {
        filterName: "В тренде",
        filterId: "trend",
        filter: [
            {
                type: "filter",
                name: "Сегодня",
                filter_media_type: "movie",
                activation: function(wrapper) {
                    return fetchAPI(this.api, wrapper, this.filter_media_type);
                },
                api: FILTERS.trending_this_day,
            },
            {
                type: "filter",
                name: "На этой неделе",
                filter_media_type: "all",
                activation: function(wrapper) {
                    return fetchAPI(this.api, wrapper, this.filter_media_type);
                },
                api: FILTERS.trending_this_week,
            },
            {
                type: "indicator",
                position: "left"
            }
        ]
    },
    {
        filterName: "Что популярно",
        filterId: "popular",
        filter: [
            {
                type: "filter",
                name: "По ТВ",
                filter_media_type: "tv",
                activation: function(wrapper) {
                    return fetchAPI(this.api, wrapper, this.filter_media_type);
                },
                api: FILTERS.popular_on_tv,
            },
            {
                type: "filter",
                name: "В кинотеатрах",
                filter_media_type: "movie",
                activation: function(wrapper) {
                    return fetchAPI(this.api, wrapper, this.filter_media_type);
                },
                api: FILTERS.popular_on_theatres,
            },
            {
                type: "indicator",
                position: "left"
            }
        ]
    },
];

var months = [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "авгутс",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь",
];

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

async function fetchAPI(url, results_wrapper, type, page = 1) {
    await fetch(`${main_api_url}${url}api_key=${api_key}&language=ru-RU&page=${page}`)
    .then(result => result.json())
    .then(obj => showMovie(obj.results, results_wrapper, type));
};

async function logAPI(url) {
    await fetch(`https://api.themoviedb.org/3${url}api_key=${api_key}`)
    .then(result => result.json())
    .then(obj => obj.results ? showOnConsole(obj.results) : console.log(obj));
};

function showOnConsole(arr) {
    arr.forEach(item => console.log(item));
};

function activateFilter(filterName, position) {
    var item = document.querySelector(`#${filterName} > .list_filter_wrapper`);
    var leftFilter = item.firstElementChild;
    var rightFilter = leftFilter.nextSibling.nextElementSibling;
    var indicator = rightFilter.nextElementSibling;
    leftFilter.classList.remove("active_filter");
    rightFilter.classList.remove("active_filter");
    listFilters.forEach(filter => {
        if (filter.filterId === filterName) {
            if (position == "left" || leftFilter.className.includes("active_filter") || indicator.className.includes("indicator_on_left")) {
                filter.filter[0].activation(filterName);
                indicator.classList.remove("indicator_on_right");
                rightFilter.classList.remove("active_filter");
                leftFilter.classList.add("active_filter");
                setTimeout(() => {
                    indicator.style.left = "0";
                    indicator.style.width = `${leftFilter.offsetWidth}px`;
                }, 0);
            };
            if (position == "right" || rightFilter.className.includes("active_filter") || indicator.className.includes("indicator_on_right")) {
                filter.filter[1].activation(filterName);
                indicator.classList.remove("indicator_on_left");
                leftFilter.classList.remove("active_filter");
                rightFilter.classList.add("active_filter");
                setTimeout(() => {
                    indicator.style.left = `${leftFilter.offsetWidth}px`;
                    indicator.style.width = `${rightFilter.offsetWidth}px`;
                }, 0)
            };
        };
    });
};

function showFilters() {
    listFilters.forEach(filter => {
        if (document.getElementById(filter.filterId)) {
            let res = document.getElementById(filter.filterId);
            res.classList.add("list_head_wrapper");
            res.innerHTML = `
                <span class="list_title">${filter.filterName}</span>
                <div class="list_filter_wrapper">
                    <span class="filter_item" onclick="activateFilter(\`${filter.filterId}\`, \`left\`)">${filter.filter[0].name}</span>
                    <span class="filter_item" onclick="activateFilter(\`${filter.filterId}\`, \`right\`)">${filter.filter[1].name}</span>
                    <span class="indicator indicator_on_${filter.filter[2].position}"></span>
                    <span class="list_shadow"></span>
                </div>
            `;

            activateFilter(filter.filterId);
        };
    });
};

function showDateOfMovie(date, time) {
    if (date && time) {
        var year = date.slice(0, 4);
        var month = +(date.slice(5, 7));
        month = months[month - 1].slice(0, 3);
        var day = (date.slice(8, 10));
        if (date.length == 10) {
            if (time == "date") {
                return `${day} ${month} ${year}`;
            };
            if (time == "year") {
                return `${year}`;
            };
            if (time == "day") {
                return `${day}`;
            };
            if (time == "month") {
                return `${month}`;
            };
        };
    }
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

function getMovieLink(movie_id, movie_name) {
    return `/${movie_id}-${`${movie_name.split(":").join(" ").split(".").join(" ").split(" ").join("-")}`.toLowerCase()}`;
};

function showMovie(arr, results_wrapper, type) {
    let res = document.getElementById(results_wrapper).nextElementSibling;
    res.innerHTML = "";
    
    arr.forEach(movie => {
        var movie_link = `https://www.themoviedb.org/${movie.media_type ?? type}${getMovieLink(movie.id, (movie.original_title ?? movie.original_name))}`
        res.innerHTML += `
        <div class="card_wrapper">
            <a href="${movie_link}" class="img_wrapper">
                <img class="card_img" src="${images_url}/${movie.poster_path}">
            </a>
            <div class="about_card_wrapper">
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
                <a class="card_title">
                    ${movie.title ?? movie.name}
                </a>
                <div class="card_date">
                    ${showDateOfMovie(movie.release_date ?? movie.first_air_date, "date") ?? ""}
                </div>
            </div>
        </div>
        `;
    });
};

showFilters();