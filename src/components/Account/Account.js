import { PATH, KEY, RUS } from "../../constants/api";
import { ROOT_ACCOUNT } from "../../constants/root";
import { getDataApi } from "../../utils/getDataApi";
import Login from "../Login";
import Movie from "../Movie";
import App from "../App";

import classes from "./Account.css";


class Account {
    async getDataAccount(url, config) {
        const data = await getDataApi.getData(url, { params: config });
        return data;
    }

    async getFavorites() {
        const url = `${PATH.ACCOUNT}/${Login._accountId}/favorite/movies`;
        const config = { api_key: KEY, session_id: Login._sessionId, language: RUS }
        const data = await getDataApi.getData(url, { params: config });
        return data.data.results;
    }

    async checkMovieInFavorites(movieId) {
        const data = await this.getFavorites();
        for (let i = 0; i < data.length; i++) {
            if (data[i].id == movieId) {
                return true;
            }
        }
        return false;
    }

    eventListenner() {
        const userDiv = document.getElementById("hello");
        const clickAccount = (event) => {
            event.preventDefault();
            this.render();
        }
        userDiv.onclick = clickAccount;
    }

    async render() {
        const data = await new Account().getFavorites();
        App.clear(document.getElementsByTagName("main")[0]);

        const htmlContent = `
            <div class="${classes.account_container}">
                <div class="${classes.favorites_container}">
                    <h3>Избранное</h3>
                    <div class="${classes.favorites_content}" id="favoritesContent"></div>
                </div>
                <hr>
                <div class="${classes.recommendation_container}">
                    <h3>Рекомендации</h3>
                    <div class="${classes.recommendation_content}" id="recommendationContent"></div>
                </div>
            </div>
        `;

        ROOT_ACCOUNT.innerHTML = htmlContent;

        await Movie.renderContent(data, document.getElementById("favoritesContent"));
        Movie.eventListener();

        try {
            let id = document.getElementsByTagName("figure")[0].getAttribute("id");
            console.log(id)
            Movie.url = PATH.RECOMENDATION_1 + id + PATH.RECOMENDATION_2;
            Movie.param = {
                api_key: KEY,
                language: RUS,
                page: 1,
            };

            await Movie.render(document.getElementById("recommendationContent"));
            Movie.eventListener();
        } catch (e) {
            if (e instanceof TypeError) {
                document.getElementById("recommendationContent").innerText = "Для получения рекомендаций добавьте фильм в избранное."
            }
        }
    }
}

export default new Account();