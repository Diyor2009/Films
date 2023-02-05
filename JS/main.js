var main_api_url = "https://api.themoviedb.org/3";
var api_key = "d14b1adbe04d8ccc380f0580684188f5";
var images_url = "https://image.tmdb.org/t/p/original";
var header = document.getElementsByTagName("header")[0];
var res_wrapper = document.getElementById("result");

const FILTERS = {
    trending_this_day: "/trending/all/day?",
    trending_this_week: "/trending/all/week?",
    popular: "movie/popular",
}

var listFilters = [
    {
        filterName: "В тренде",
        filterId: "trend",
        filter: [
            {
                type: "filter",
                name: "Сегодня",
                activation: function(wrapper) {
                    return fetchAPI(this.api, wrapper);
                },
                api: FILTERS.trending_this_day,
            },
            {
                type: "filter",
                name: "На этой неделе",
                activation: function(wrapper) {
                    return fetchAPI(this.api, wrapper);
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
        filterName: "Последние трейлеры",
        filterId: "lates_trailers",
        filter: [
            {
                type: "filter",
                name: "По ТВ",
                activation: function(wrapper) {
                    return fetchAPI(this.api, wrapper);
                },
                api: FILTERS.trending_this_day,
            },
            {
                type: "filter",
                name: "В кинотеатрах",
                activation: function(wrapper) {
                    return fetchAPI(this.api, wrapper);
                },
                api: FILTERS.trending_this_week,
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

showFilters();

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

async function fetchAPI(url, results_wrapper, page = 1) {
    await fetch(`${main_api_url}${url}api_key=${api_key}&language=ru-RU&page=${page}`)
    .then(result => result.json())
    .then(obj => showMovie(obj.results, results_wrapper));
}

async function logAPI(url) {
    await fetch(`${main_api_url}${url}api_key=${api_key}&language=ru-RU`)
    .then(result => result.json())
    // .then(obj => console.log(obj.results));
}

logAPI(FILTERS.test);

function activateFilter(filterName, position) {
    var item = document.querySelector(`#${filterName} > .list_filter_wrapper`);
    var leftFilter = item.firstElementChild;
    var rightFilter = leftFilter.nextSibling.nextElementSibling;
    var indicator = rightFilter.nextElementSibling;
    leftFilter.classList.remove("active_filter");
    rightFilter.classList.remove("active_filter");
    if (position == "left" || leftFilter.className.includes("active_filter") || indicator.className.includes("indicator_on_left")) {
        indicator.classList.remove("indicator_on_right");
        rightFilter.classList.remove("active_filter");
        leftFilter.classList.add("active_filter");
        indicator.style.left = "0";
        indicator.style.width = `${leftFilter.offsetWidth}px`;
        listFilters[0].filter[0].activation(filterName);
    }
    if (position == "right" || rightFilter.className.includes("active_filter") || indicator.className.includes("indicator_on_right")) {
        listFilters[0].filter[1].activation(filterName);
        indicator.classList.remove("indicator_on_left");
        leftFilter.classList.remove("active_filter");
        rightFilter.classList.add("active_filter");
        indicator.style.left = `${leftFilter.offsetWidth}px`;
        indicator.style.width = `${rightFilter.offsetWidth}px`;
    }
}

function showFilters() {
    listFilters.forEach(filter => {
        if (document.getElementById(filter.filterId)) {
            let res = document.getElementById(filter.filterId);
            res.classList.add("list_head_wrapper");
            res.innerHTML = `
                <span class="list_title">${filter.filterName}</span>
                <div class="list_filter_wrapper">
                    <span class="filter_item" onclick="activateFilter(\`${filter.filterId}\`, \`left\`)">${filter.filter[0].name}</span>
                    <span class="filter_item" onclick="activateFilter(\`${filter.filterId}\`, \'right\')">${filter.filter[1].name}</span>
                    <span class="indicator indicator_on_${filter.filter[2].position}"></span>
                </div>
            `;
            activateFilter(filter.filterId);
        }
    })
}

function showDateOfMovie(date) {
    var year = date.slice(0, 4);
    var month = +(date.slice(5, 7));
    month = months[month - 1].slice(0, 3);
    var day = (date.slice(8, 10));
    return `${day} ${month} ${year}`
}

function getPercentColor(percent) {
    if (percent >= 70) {
        return "#21d07a";
    } else if (percent <= 30) {
        return "#db2360";
    } else if (percent < 70) {
        return "#d2d531";
    }
}

function showMovie(arr, results_wrapper, type) {
    let res = document.getElementById(results_wrapper).nextElementSibling;
    res.innerHTML = "";

    arr.forEach(movie => {
        console.log(movie);
        res.innerHTML += `
        <div class="card_wrapper">
            <a href="${movie}" class="img_wrapper">
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
                <div class="card_title">
                    ${movie.title ?? movie.name}
                </div>
                <div class="card_date">
                    ${showDateOfMovie(movie.release_date ?? movie.first_air_date)}
                </div>
            </div>
        </div>
        `;
    });
};