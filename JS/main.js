var main_api_url = "https://api.themoviedb.org/3";
var api_key = "d14b1adbe04d8ccc380f0580684188f5";
var header = document.getElementsByTagName("header")[0];

const FILTERS = {
    trending_this_day: "/trending/all/day?",
    trending_this_week: "/trending/all/week?",
}

var listFilters = [
    {
        filterPosition: 1,
        filterName: "В тренде",
        filterId: "trend",
        filter: [
            {
                type: "filter",
                name: "Сегодня",
                // activation: fetchAPI()
            },
            {
                type: "filter",
                name: "На этой неделе",
                // activation: fetchAPI()
            },
        ]
    },
    {
        filterPosition: 1,
        filterName: "В тренде",
        filterId: "hello",
        filter: [
            {
                type: "filter",
                name: "Hello 1",
                // activation: fetchAPI()
            },
            {
                type: "filter",
                name: "Hello 2",
                // activation: fetchAPI()
            },
        ]
    },
]

showFilters()

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

// fetchAPI(FILTERS_API.trending);
// fetchAPI(FILTERS.trending_this_week);

// async function fetchAPI(url, page = 1, results_wrapper) {
//     await fetch(`${main_api_url}${url}api_key=${api_key}&language-ru-RU&page=${page}`)
//     .then(result => result.json())
//     .then(obj => showMovie(obj.results, results_wrapper))
// }

function activateFilter(filterName) {
}

function showFilters() {
    listFilters.forEach(filter => {
        let res = document.getElementById(filter.filterId);
        res.classList.add("list_filter_wrapper");
        res.innerHTML = `
            <span class="filter_item active">${filter.filter[0].name}</span>
            <span class="filter_item">${filter.filter[1].name}</span>
            <span class="indicator" onclick="activateFilter(\`${filter.filterId}\`)"></span>
        `
    })
}

// function showMovie(arr, resutls_wrapper) {
//     var res = document.getElementById(resutls_wrapper);
//     res.innerHTML = "";

//     arr.forEach(movie => {
//         res.innerHTML += `
//         `
//     })
// }