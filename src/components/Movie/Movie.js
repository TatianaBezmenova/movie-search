import { PATH, KEY, RUS } from "../../constants/api";
import { ROOT_INDEX } from "../../constants/root";
import { getDataApi } from "../../utils/getDataApi";
import Error from "../Error";
import ImageConfig from "../ImageConfig";
import MovieInformation from "../MovieInformation";

import classes from "./Movie.css";

const MAX_LENGTH_TITLE = 32;

class Movie {
    _url = "";
    _param = {
        api_key: KEY,
        language: RUS,
        page: 1,
    };
    _totalPages = 1;

    async render(root = ROOT_INDEX) {
        let data = await getDataApi.getData(this._url, { params: this._param });
        this._totalPages = data.data.total_pages;
        data ? this.renderContent(data, root) : Error.render();
    }

    renderContent(data, root) {
        try {
            data = JSON.parse(data.request.response).results;
        } catch {
            data = data;
        }
        let htmlContent;
        if (data.length > 0) {
            if (this._param.page == 1) {
                htmlContent = "";

            } else {
                htmlContent = root.innerHTML;
            }

            root.classList.add(classes.root);

            const config = ImageConfig.config;
            data.forEach(({ id, poster_path, release_date, title, vote_average }) => {
                if (poster_path !== null) {
                    const uri = PATH.SEARCH_MOVIE_ID + id;
                    const imgSrc = config.baseUrl + config.posterSize + poster_path;

                    let shortTitle = "";
                    if (title.length > MAX_LENGTH_TITLE) {
                        shortTitle = title.slice(0, MAX_LENGTH_TITLE) + "...";
                    } else {
                        shortTitle = title;
                    }

                    let year = "";
                    if (release_date !== undefined) {
                        year = release_date.slice(0, 4);
                    }

                    htmlContent += `
                    <figure id="${id}" class="movie_card ${classes.movie_card}" data-uri="${uri}">
                        <img src="${imgSrc}" class="${classes.movie_card__poster}" title="${title}">
                        <figcaption class="${classes.movie_card__title}">${shortTitle}</figcaption>
                        <div class="${classes.movie_card__footer}">
                            <div>${year}</div>
                            <div class="${classes.movie_card__footer__voit}">
                                <div class="${classes.icon_voit}"></div>
                                <div>${vote_average}</div>
                            </div>
                        </div>
                    </figure>
                `;
                }
            });

        } else {
            htmlContent = `
                <div>По Вашему запросу ничего не найдено.</div>
            `;
        }
        root.innerHTML = htmlContent;
    }

    eventListener() {
        document.querySelectorAll(".movie_card").forEach(element => {
            const uri = element.getAttribute("data-uri");
            element.addEventListener("click", () => {
                MovieInformation.render(uri, MovieInformation.param);
            })
        })
    }

    get url() {
        return this._url;
    }

    set url(value) {
        this._url = value;
    }

    get param() {
        return this._param;
    }

    set param(value) {
        this._param = value;
    }

    getPage() {
        return this._param.page;
    }

    setPage(page) {
        this._param.page = page;
    }

    get totalPages() {
        return this._totalPages;
    }

}

export default new Movie();