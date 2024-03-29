var main_filters_wrapper = document.getElementsByClassName("main_films_wrapper")[0];
var filmsListWrapper = document.getElementsByClassName("films_list");
var main_api_url = "https://api.themoviedb.org/3";
var api_key = "d14b1adbe04d8ccc380f0580684188f5";
var images_url = "https://image.tmdb.org/t/p/original";
var header = document.getElementsByTagName("header")[0];
var img = document.getElementById("img");

const FILTERS = {
    trending_this_day: "/trending/all/day?",
    trending_this_week: "/trending/all/week?",
    popular_on_theatres: "/movie/popular?",
    popular_on_tv: "/tv/popular?",
    top_rated_on_tmdb: "/movie/top_rated?",
    top_rated_on_tv: "/tv/top_rated?",
};

var listFilters = [
    {
        backgrounded: false,
        filterName: "Trending",
        filterId: "trend",
        filter: [
            {
                type: "filter",
                name: "Today",
                filter_media_type: "movie",
                activation: function(wrapper, type) {
                    return fetchAPI(this.api, wrapper, this.filter_media_type, type);
                },
                api: FILTERS.trending_this_day,
            },
            {
                type: "filter",
                name: "This week",
                filter_media_type: "all",
                activation: function(wrapper, type) {
                    return fetchAPI(this.api, wrapper, this.filter_media_type, type);
                },
                api: FILTERS.trending_this_week
            },
            {
                type: "indicator",
                position: "left"
            }
        ]
    },
    {
        backgrounded: true,
        filterName: "Top Rated",
        filterId: "top_rated",
        filter: [
            {
                type: "filter",
                name: "On TV",
                filter_media_type: "tv",
                activation: function(wrapper, type) {
                    return fetchAPI(this.api, wrapper, this.filter_media_type, type);
                },
                api: FILTERS.top_rated_on_tv,
            },
            {
                type: "filter",
                name: "On TMDB",
                filter_media_type: "movie",
                activation: function(wrapper, type) {
                    return fetchAPI(this.api, wrapper, this.filter_media_type, type);
                },
                api: FILTERS.top_rated_on_tmdb,
            },
            {
                type: "indicator",
                position: "left"
            }
        ]
    },
    {
        backgrounded: false,
        filterName: "What's Popular",
        filterId: "popular",
        filter: [
            {
                type: "filter",
                name: "On TV",
                filter_media_type: "tv",
                activation: function(wrapper, type) {
                    return fetchAPI(this.api, wrapper, this.filter_media_type, type);
                },
                api: FILTERS.popular_on_tv
            },
            {
                type: "filter",
                name: "In Theatres",
                filter_media_type: "movie",
                activation: function(wrapper, type) {
                    return fetchAPI(this.api, wrapper, this.filter_media_type, type);
                },
                api: FILTERS.popular_on_theatres,
            },
            {
                type: "indicator",
                position: "left"
            }
        ]
    }
];

var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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

async function fetchAPI(url, results_wrapper, media_type, type, page = 1) {
    await fetch(`${main_api_url}${url}api_key=${api_key}&language=en-US&page=${page}`)
    .then(result => result.json())
    .then(obj => showMovie(obj.results, results_wrapper, media_type, type));
};

function activateFilter(filterName, position) {
    var item = document.querySelector(`#${filterName} > .list_filter_wrapper`);
    var leftFilter = item.firstElementChild;
    var rightFilter = leftFilter.nextSibling.nextElementSibling;
    var indicator = rightFilter.nextElementSibling;
    leftFilter.classList.remove("active_filter");
    rightFilter.classList.remove("active_filter");
    listFilters.forEach(filter => {
        if (filter.filterId == filterName) {
            if (position == "left" || leftFilter.className.includes("active_filter") || indicator.className.includes("indicator_on_left")) {
                filter.filter[0].activation(filterName, `${filter.backgrounded}`);
                indicator.classList.remove("indicator_on_right");
                rightFilter.classList.remove("active_filter");
                leftFilter.classList.add("active_filter");
                indicator.style.left = "0";
                indicator.style.width = `${leftFilter.offsetWidth}px`;
            };
            if (position == "right" || rightFilter.className.includes("active_filter") || indicator.className.includes("indicator_on_right")) {
                filter.filter[1].activation(filterName, `${filter.backgrounded}`);
                indicator.classList.remove("indicator_on_left");
                leftFilter.classList.remove("active_filter");
                rightFilter.classList.add("active_filter");
                indicator.style.left = `${leftFilter.offsetWidth}px`;
                indicator.style.width = `${rightFilter.offsetWidth}px`;
            };
        };
    });
};

function showFilters() {
    main_filters_wrapper.innerHTML = "";
    listFilters.forEach(filter => {
        if (filter.backgrounded == false) {
            main_filters_wrapper.innerHTML += `
                <section>
                    <div class="films_list_wrapper">
                        <div class="list_head_wrapper" id="${filter.filterId}">
                            <span class="list_title">${filter.filterName}</span>
                            <div class="list_filter_wrapper">
                                <span class="filter_item" onclick="activateFilter(\`${filter.filterId}\`, \`left\`)">${filter.filter[0].name}</span>
                                <span class="filter_item" onclick="activateFilter(\`${filter.filterId}\`, \`right\`)">${filter.filter[1].name}</span>
                                <span class="indicator indicator_on_${filter.filter[2].position}"></span>
                            </div>
                        </div>
                        <div class="films_list">
                        </div>
                    </div>
                </section>
            `;
        } else {
            main_filters_wrapper.innerHTML += `
                <section class="backgrounded_filter_section">
                    <div class="films_list_wrapper backgrounded">
                        <div class="list_head_wrapper" id="${filter.filterId}">
                            <span class="list_title">${filter.filterName}</span>
                            <div class="list_filter_wrapper">
                                <span class="filter_item" onclick="activateFilter(\`${filter.filterId}\`, \`left\`)">${filter.filter[0].name}</span>
                                <span class="filter_item" onclick="activateFilter(\`${filter.filterId}\`, \`right\`)">${filter.filter[1].name}</span>
                                <span class="indicator indicator_on_${filter.filter[2].position}"></span>
                            </div>
                        </div>
                        <div class="films_list">
                        </div>
                    </div>
                </section>
            `;
        }
        activateFilter(filter.filterId);
    });
};

showFilters();

for (const list of filmsListWrapper) {
    // list.addEventListener("scroll", function() {
        // let wrapper = this.parentElement;
        // if (this.pageXOffset == "0 0 0") {
        //     console.log('0');
        // }
    //     console.log(this.pageXOffset);
    // })
    console.log(list.parentElement.parentElement);
}

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

function showMovie(arr, results_wrapper, type, backgrounded) {
    let res = document.getElementById(results_wrapper).nextElementSibling;
    res.innerHTML = "";
    arr.forEach(movie => {
        if (backgrounded == "false") {
            res.innerHTML += `
            <div class="card_wrapper">
                <a class="img_wrapper" onclick="getDetailsOfMovie(\`${movie.id}\`, \`${movie.media_type ?? type}\`)">
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
                    <a class="card_title" onclick="getDetailsOfMovie(\`${movie.id}\`, \`${movie.media_type ?? type}\`)">
                        ${movie.title ?? movie.name}
                    </a>
                    <div class="card_date">
                        ${showDateOfMovie(movie.release_date ?? movie.first_air_date, "date") ?? ""}
                    </div>
                </div>
            </div>
            `;
        } else {
            card_backdrop = `${images_url}/${movie.backdrop_path}`;
            res.innerHTML += `
                <div class="long_card" onmouseover="addBackground(\`${results_wrapper}\`, \`${card_backdrop}\`)">
                    <a class="img_wrapper" onclick="getDetailsOfMovie(\`${movie.id}\`, \`${movie.media_type ?? type}\`)">
                        <img class="card_img" src="${card_backdrop}">
                    </a>
                    <div class="about_card_wrapper">
                        <a class="card_title" onclick="getDetailsOfMovie(\`${movie.id}\`, \`${movie.media_type ?? type}\`)">
                            ${movie.title ?? movie.name}
                        </a>
                    </div>
                </div>
            `;
            addBackground(results_wrapper);
        };
    });
};

function addBackground(wrapper_id, background) {
    var wrapper = document.getElementById(wrapper_id);
    var section = wrapper.parentElement.parentElement;
    if (background) {
        section.style.backgroundImage = `url(${background})`;
    } else {
        section.style.backgroundImage = `url(${wrapper.nextElementSibling.firstElementChild.firstElementChild.firstElementChild.src})`;
    };
};

function getDetailsOfMovie(id, media_type) {
    location.href = `${location.protocol}//${location.host}/HTML/movies.html?id=${id}&media_type=${media_type}`;
};