var main_api_url = "https://api.themoviedb.org/3";
var api_key = "api_key=d14b1adbe04d8ccc380f0580684188f5";
var popular_films_url = `${main_api_url}/dicover`;

var header = document.getElementsByTagName("header")[0];
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