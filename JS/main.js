var main_api_url = "https://api.themoviedb.org/3";
var api_key = "d14b1adbe04d8ccc380f0580684188f5";
var images_url = "https://image.tmdb.org/t/p/original";
var header = document.getElementsByTagName("header")[0];

const FILTERS = {
    trending_this_day: "/trending/all/day?",
    trending_this_week: "/trending/all/week?",
}

var listFilters = [
    {
        filterName: "В тренде",
        filterId: "trend",
        filter: [
            {
                type: "filter",
                name: "Сегодня",
                activation: function(f) {
                    return fetchAPI(this.api);
                },
                api: FILTERS.trending_this_day,
            },
            {
                type: "filter",
                name: "На этой неделе",
                activation: function(f) {
                    return fetchAPI(this.api);
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
    .then(obj => showMovie(obj.results, results_wrapper))
}

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
    }
    if (position == "right" || rightFilter.className.includes("active_filter") || indicator.className.includes("indicator_on_right")) {
        indicator.classList.remove("indicator_on_left");
        leftFilter.classList.remove("active_filter");
        rightFilter.classList.add("active_filter");
        window.onunload = () => {
            indicator.style.left = `${leftFilter.offsetWidth}px`;
            indicator.style.width = `${rightFilter.offsetWidth}px`;
        }
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

listFilters[0].filter[0].activation()

function showMovie(arr, resutls_wrapper) {
    // var res = document.getElementById(resutls_wrapper);
    // res.innerHTML = "";

    arr.forEach(movie => {
        res.innerHTML += `
            <div class="movie_card">
                <img class="card" src="${images_url}${movie.poster_path}">
            </div>
        `
    })
}