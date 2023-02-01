var main_api_url = "https://api.themoviedb.org/3/";
var api_key = "d14b1adbe04d8ccc380f0580684188f5";
var header = document.getElementsByTagName("header")[0];

var listFilters = [
    {
        filterPosition: 1,
        filterName: "В тренде",
        filterId: "trend",
        filter: [
            {
                name: "Сегодня",
                activation: fetchAPI()
            }
        ]
    },
]

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

fetchAPI(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language-ru-RU&page=2`);

async function fetchAPI(url, page = 1, results_wrapper) {
    await fetch(`${main_api_url}${url}`)
    .then(result => result.json())
    .then(resArray => show(resArray.results, ))
}

function activeFilter(filterName) {
    
}

function show(arr, resutls_wrapper) {
}