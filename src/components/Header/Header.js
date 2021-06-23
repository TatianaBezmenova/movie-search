import { ROOT_HEADER, ROOT_MODAL_MOVIE, ROOT_ACCOUNT } from "../../constants/root";
import Search from "../Search/Search";
import AdvancedSearch from "../AdvancedSearch/AdvancedSearch";
import Movie from "../Movie";
import { PATH, KEY, RUS } from "../../constants/api";
import classes from "./Header.css";

class Header {
    render() {
        ROOT_HEADER.classList.add(classes.header);
        const html = `
            <form action="#" class="${classes.header_form}" name="header-form">
                <div class="${classes.header_left}">
                    <div class="${classes.header_search}">
                        <div class="${classes.header_search__global}">
                            <div>
                                <input type="text" id="inpGlobalSearch" placeholder="поиск...">
                            </div>
                            <div>
                                <button id="btnGlobalSearch"></button>
                            </div>
                        </div>
                        <div class="${classes.header_search__advanced}" id="btnAdvancedSearch">Расширенный поиск</div>
                    </div>

                    <div class="${classes.header_popular}" id="btnPopular">Популярные фильмы</div>
                </div>

                <div class="${classes.header_login}" id="loginContent">
                    <div class="${classes.header_login__user}" id="hello"></div>
                    <div class="${classes.header_login__buttons}" id="login"><button id="btnLogin" class="button" data-close="modalMovie">Войти</button></div>
                </div>
            </form>
        `;
        ROOT_HEADER.innerHTML = html;

        Search.eventListener();
        AdvancedSearch.eventListener();
        const divPopular = document.getElementById("btnPopular");
        this.eventListenerForPopular(divPopular);
    }
    eventListenerForPopular(div) {
        const click = async(event) => {
            Movie.url = PATH.SEARCH_MOVIE_POPULAR;
            Movie.param = {
                api_key: KEY,
                language: RUS,
                page: 1,
            };
            ROOT_MODAL_MOVIE.innerHTML = "";
            ROOT_ACCOUNT.innerHTML = "";
            event.stopPropagation();
            await Movie.render();
            Movie.eventListener();
        }
        div.onclick = click;
    }
}

export default new Header();