import { ROOT_INDEX, ROOT_ACCOUNT, ROOT_MODAL_MOVIE } from "../../constants/root";
import { PATH } from "../../constants/api";
import Header from "../Header";
import ImageConfig from "../ImageConfig";
import Movie from "../Movie";
import Account from "../Account";
import Login from "../Login";
import "./App.css";



class App {
    async render() {
        Header.render();
        await ImageConfig.getImageConfig();
        Movie.url = PATH.SEARCH_MOVIE_POPULAR;
        await Movie.render();
    }

    clear(parentDiv) {
        for (let i = 0; i < parentDiv.childElementCount; i++) {
            parentDiv.children[i].innerHTML = "";
        }
    }
}

export default new App();

//Регистрация
window.addEventListener("load", async() => {
    await Login.getUserConfig();
});



// Обработка прокрутки страницы
window.addEventListener("scroll", async() => {
    var scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    );
    if ((window.scrollY >= (scrollHeight - innerHeight - 2)) && ROOT_INDEX.innerHTML != "" && Movie.getPage() < Movie.totalPages) {
        Movie.setPage(Movie.getPage() + 1);
        await Movie.render();
        Movie.eventListener();
    }
})

// Закрытие модального окна
window.addEventListener("click", async(event) => {
    if (event.target.getAttribute("data-close") === "modalMovie") {
        ROOT_MODAL_MOVIE.innerHTML = "";
        event.stopPropagation();

        if (ROOT_ACCOUNT.innerHTML != "") {
            Account.render();
        }
    }
})