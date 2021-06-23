import { KEY, PATH, RUS } from "../../constants/api";
import { ROOT_ACCOUNT, ROOT_MODAL_MOVIE } from "../../constants/root";
import { getDataApi } from "../../utils/getDataApi";
import { postDataApi } from "../../utils/postDataApi";
import ImageConfig from "../ImageConfig";
import Login from "../Login"
import Account from "../Account"

import imgClose from "./img/close_blue.svg"
import classes from "./MovieInformation.css"
import Movie from "../Movie/Movie";

class MovieInformation {
    _movieId = null;
    _param = {
        api_key: KEY,
        language: RUS,
    };

    async render(uri, param) {
        let data = await getDataApi.getData(uri, { params: param });
        data ? this.renderContent(data) : Error.render();
    }

    async getActors(uri, param) {
        let data = await getDataApi.getData(uri, { params: param });
        data = data.data.cast;
        return data;
    }

    async renderContent(data) {
        const config = ImageConfig._config;
        data = JSON.parse(data.request.response);
        let htmlContent = "";
        this._movieId = data.id;

        //Запрос актеров
        const urlActors = PATH.CREDITS_1 + this._movieId + PATH.CREDITS_2;
        const paramActors = {
            api_key: KEY,
            language: RUS,
            page: 1,
        };

        let dataActors = await this.getActors(urlActors, paramActors);

        htmlContent = `
            <div class="${classes.modal}" data-close="modalMovie"> 
                <div class="${classes.modal_close}" id="btnCloseModal" data-close="modalMovie" style="background-image: url(${imgClose})"></div>    
                <div class="${classes.movie_modal}">
                    <div class="${classes.movie_modal__poster}">
                        <img src="${config.baseUrl + config.bigPosterSize + data.poster_path}" class="${classes.movie_modal__poster_img}">
                    </div>
                    <div class="${classes.movie_modal__content}">
                        <h3>${data.title}</h3>
                        <div>
                            <span class="${classes.year}">${data.release_date.slice(0, 4)}</span>
                            <span>Продолжительность ${data.runtime} мин</span>
                        </div>
                        <div>${data.overview}</div>
                        <div id="genres_ref" class=${classes.genres}></div>
                        <div id="userAction" class="${classes.user_action}"></div>
                        <div id="simular" class="${classes.simular} reference">Найти похожие фильмы</div>
                        <div id="actors" class="${classes.actors}">В фильме снимались:
                            <div id="actorsContent" class="${classes.actorsContent}"></div>    
                        </div>    
                    </div>

                </div>
            </div>    
        `;

        ROOT_MODAL_MOVIE.innerHTML = htmlContent;

        const divGenres = document.getElementById("genres_ref");
        for (let i = 0; i < data.genres.length; i++) {
            let a = document.createElement("a");
            a.classList.add(classes.genre_ref);
            a.classList.add("reference");
            a.innerText = data.genres[i].name;
            a.id = data.genres[i].id;
            a.href = "#";
            this.eventListenerForGenreRef(a);
            divGenres.appendChild(a);
        }

        const divActors = document.getElementById("actorsContent");
        for (let i = 0; i < 10 && i < dataActors.length; i++) {
            if (dataActors[i].profile_path == null) {
                continue;
            }
            const figure = document.createElement("figure");
            figure.id = dataActors[i].id;
            figure.classList.add(classes.actors_card);
            const img = document.createElement("img");
            img.src = ImageConfig.config.baseUrl + ImageConfig.config.profileSizes + dataActors[i].profile_path;
            figure.appendChild(img);
            const title = document.createElement("figcaption");
            title.innerText = dataActors[i].name;
            figure.appendChild(title);
            divActors.appendChild(figure);
            this.eventListenerForActor(figure, dataActors[i].id)
        }

        if (Login._isLogin) {
            await this.createFavoritesButton();
            this.eventListenerFavoritesButton();
        }

        const simular = document.getElementById("simular");
        this.eventListenerForSimular(simular, this._movieId);


    }

    async createFavoritesButton() {
        const div = document.getElementById("userAction");
        let htmlContent = "";
        if (await Account.checkMovieInFavorites(this._movieId)) {
            htmlContent = `
                <div id="btnFavoritesRemove" class="${classes.favorites_remove}">Удалить из избранного</div>
            `;
        } else {
            htmlContent = `
                <div id="btnFavoritesAdd" class="${classes.favorites_add} reference">Добавить в избранное</div>
            `;
        }

        div.innerHTML = htmlContent;
    }

    eventListenerFavoritesButton() {
        const favoritesAdd = document.getElementById("btnFavoritesAdd");
        if (favoritesAdd !== null) {
            const click = (event) => {
                event.preventDefault();
                this.addFavourites(true);
            }
            favoritesAdd.onclick = click;
        }

        const favoritesRemove = document.getElementById("btnFavoritesRemove");
        if (favoritesRemove !== null) {
            const click = (event) => {
                event.preventDefault();
                this.addFavourites(false);
            }
            favoritesRemove.onclick = click;
        }
    }

    async addFavourites(needFavorite) {
        const url = PATH.ACCOUNT + "/" + Login._accountId + "/favorite?api_key=" + KEY + "&session_id=" + Login._sessionId;
        const param = { "media_type": "movie", "media_id": this._movieId, "favorite": needFavorite }
        const data = await postDataApi.postData(url, param);
        await this.createFavoritesButton();
        await this.eventListenerFavoritesButton();
    }

    get param() {
        return this._param;
    }

    eventListenerForGenreRef(a) {
        const click = async(event) => {
            Movie.url = PATH.DISCOVER_MOVIE;
            Movie.param = {
                api_key: KEY,
                language: RUS,
                page: 1,
                with_genres: a.id
            };
            ROOT_MODAL_MOVIE.innerHTML = "";
            event.stopPropagation();
            await Movie.render();
            Movie.eventListener();
        }
        a.onclick = click;
    }

    eventListenerForSimular(simular, id) {
        const click = async(event) => {
            Movie.url = PATH.SIMULAR_1 + id + PATH.SIMULAR_2;
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
        simular.onclick = click;
    }

    eventListenerForActor(actorsCard, id) {
        const click = async(event) => {
            Movie.url = PATH.DISCOVER_MOVIE;
            Movie.param = {
                api_key: KEY,
                language: RUS,
                page: 1,
                with_people: id,
            };
            ROOT_MODAL_MOVIE.innerHTML = "";
            ROOT_ACCOUNT.innerHTML = "";
            event.stopPropagation();
            await Movie.render();
            Movie.eventListener();
        }
        actorsCard.onclick = click;
    }
}

export default new MovieInformation();