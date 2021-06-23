import { KEY, PATH, RUS } from "../../constants/api";
import { ROOT_ADVANCED_SEARCH } from "../../constants/root";
import { getDataApi } from "../../utils/getDataApi";
import Genres from "../Genres";
import Movie from "../Movie";

import imgCloseUp from "./img/chevron_up.svg"
import imgCloseUpHover from "./img/chevron_up_hover.svg"
import classes from "./AdvancedSearch.css";

class AdvancedSearch {
    _param = null;
    _genre = "";
    _year = "";
    _actor = "";
    _vote = "";
    _sortByVote = "";
    _sortByYear = "";

    async render() {
        await Genres.getGenres();
        const htmlContent = `
            <div class="${classes.advanced_search_container}" id="container">    
                <form action="#" name="advanced-search-form">
                    <div>    
                        <div class="${classes.row}">
                            <div class="${classes.cell}">    
                                <label for="genre"><div>Жанр</div></label>
                                <input type="text" name="genre" id="genre" list="genreList" class="${classes.odd_input}">
                                <datalist id="genreList"></datalist>
                            </div>
                            <div class="${classes.cell}">
                                <label for="year"><div>Год выпуска</div></label>
                                <input type="text" name="year" id="year" list="yearList" maxlength="4" class="${classes.even_input}">
                                <datalist id="yearList"></datalist>
                            </div>    
                        </div>
                        <div class="${classes.row}">
                            <div class="${classes.cell}"> 
                                <label for = "actor"><div>Актер</div></label>
                                <input type="text" name="actor" id="actor" list="actorList" class="${classes.odd_input}">
                                <datalist id="actorList"></datalist>
                            </div>
                            <div class="${classes.cell}"> 
                                <label for = "vote"><div>Рейтинг не ниже</div></label>
                                <input type="text" name="vote" id="vote" list="voteList" class="${classes.even_input}">
                                <datalist id="voteList"></datalist>
                            </div>
                        </div>
                    </div>

                    <div class="${classes.row_sort}">
                        <div class="${classes.cell_1}"><label><input type="radio" name="sort_by_vote" value="not_sort" checked data-lock="false">Не сортировать по рейтингу</label></div>
                        <div class="${classes.cell_2}"><label><input type="radio" name="sort_by_vote" value="down_sort" data-lock="true">Рейтинг &darr;</label></div>
                        <div class="${classes.cell_3}"><label><input type="radio" name="sort_by_vote" value="up_sort" data-lock="true">Рейтинг &uarr;</label></div>
                    </div>

                    <div class="${classes.row_sort}">
                        <div class="${classes.cell_1}"><label><input type="radio" name="sort_by_year" value="not_sort" checked data-lock="false">Не сортировать по году</label></div>
                        <div class="${classes.cell_2}"><label><input type="radio" name="sort_by_year" value="down_sort" data-lock="true">Год выпуска &darr;</label></div>
                        <div class="${classes.cell_3}"><label><input type="radio" name="sort_by_year" value="up_sort" data-lock="true">Год выпуска &uarr;</label></div>
                    </div>

                    <button class="button" id="btnFind" style="margin-top: 15px">Найти</button>
                </form>
                <div class="close ${classes.close_back}" id="btnCloseAdvancedSearch" style="background-image: url(${imgCloseUp})"></div>
            </div>    
        `;
        ROOT_ADVANCED_SEARCH.innerHTML = htmlContent;

        this.open();

        const genreList = document.getElementById("genreList");
        genreList.innerHTML = "";
        let option = document.createElement("option");
        option.setAttribute("id", "all");
        option.innerText = "любой жанр";
        genreList.appendChild(option);
        for (let i = 0; i < Genres._data.length; i++) {
            let option = document.createElement("option");
            option.setAttribute("id", Genres._data[i].id);
            option.innerText = Genres._data[i].name;
            genreList.appendChild(option);
        }

        const yearList = document.getElementById("yearList");
        for (let i = this.getCurrentYear() + 1; i >= this.getCurrentYear() - 20; i--) {
            let option = document.createElement("option");
            option.setAttribute("id", i);
            option.innerText = i;
            yearList.appendChild(option);
        }

        const voteList = document.getElementById("voteList");
        for (let i = 10; i >= 0; i--) {
            let option = document.createElement("option");
            option.setAttribute("id", i);
            option.innerText = i;
            voteList.appendChild(option);
        }

        this.eventListenerForButtonFind();
        this.eventListenerForInputActor();
        this.eventListenerForButtonClose();

        const radiosVote = document.querySelectorAll("input[name=sort_by_vote][data-lock=true");
        const radiosYear = document.querySelectorAll("input[name=sort_by_year][data-lock=true");
        const radioVoteNotSort = document.querySelector("input[name=sort_by_vote][data-lock=false");
        const radioYearNotSort = document.querySelector("input[name=sort_by_year][data-lock=false");
        this.eventListenerForRadio(radiosVote, radiosYear);
        this.eventListenerForRadio(radiosYear, radiosVote);
        this.eventListenerForRadioNotSort(radioVoteNotSort, radiosYear);
        this.eventListenerForRadioNotSort(radioYearNotSort, radiosVote);
    }

    async autocompileActor() {
        const actor = document.getElementById("actor").value;
        const param = {
            api_key: KEY,
            language: RUS,
            query: actor,
        }

        let data = await getDataApi.getData(PATH.PERSON, { params: param });
        data = data.data.results

        const actorList = document.getElementById("actorList");
        actorList.innerHTML = "";
        for (let i = 0; i < data.length; i++) {
            let option = document.createElement("option");
            option.setAttribute("data-actor", data[i].id);
            option.innerText = data[i].name;
            actorList.appendChild(option);
        }
    }

    setParamForSearch() {
        this._year = document.getElementById("year").value;
        this._genre = document.getElementById("genre").value;
        this._actor = document.getElementById("actor").value;
        this._vote = document.getElementById("vote").value;
        this._sortByVote = document.querySelector("input[name=sort_by_vote]:checked").value;
        this._sortByYear = document.querySelector("input[name=sort_by_year]:checked").value;


        this._param = new Object();
        this._param.api_key = KEY;
        this._param.language = RUS;
        this._param.page = 1;

        if (this._genre != "любой жанр" && this._genre != "") {
            for (let i = 0; i < Genres._data.length; i++) {
                if (Genres._data[i].name == this._genre) {
                    this._genre = Genres._data[i].id;
                    break;
                }
            }
            this._param.with_genres = this._genre;
        }

        if (this._year != "") {
            this._param.primary_release_year = this._year;
        }

        if (this._actor != "") {
            let options = document.querySelectorAll("[data-actor]");
            for (let i = 0; i < options.length; i++) {
                if (this._actor == options[i].innerText) {
                    this._actor = options[i].getAttribute("data-actor");
                }
            }
            this._param.with_people = this._actor;
        }

        if (this._vote != "") {
            this._param["vote_average.gte"] = this._vote;
        }

        if (this._sortByVote == "up_sort") {
            this._param.sort_by = "vote_average.asc"
        } else if (this._sortByVote == "down_sort") {
            this._param.sort_by = "vote_average.desc"
        }

        if (this._sortByYear == "up_sort") {
            this._param.sort_by = "release_date.asc"
        } else if (this._sortByYear == "down_sort") {
            this._param.sort_by = "release_date.desc"
        }
    }

    async find() {
        await this.setParamForSearch();
        Movie.url = PATH.DISCOVER_MOVIE;
        Movie.param = this._param;
        await Movie.render();
        await Movie.eventListener();
    }

    getCurrentYear() {
        let date = new Date();
        return date.getFullYear() + 1;
    }

    open() {
        const div = document.getElementById("container");
        div.classList.remove(classes.close)
        div.classList.add(classes.open)
    }

    close() {
        const div = document.getElementById("container");
        div.classList.remove(classes.open)
        div.classList.add(classes.close)
        setTimeout(() => (div.style.display = "none"), 1000)
    }

    eventListener() {
        const btn = document.getElementById("btnAdvancedSearch");
        const click = (event) => {
            event.preventDefault();
            this.render();
        }
        btn.onclick = click;
    }

    eventListenerForButtonFind() {
        const btn = document.getElementById("btnFind");
        const click = (event) => {
            event.preventDefault();
            this.close();
            this.find();
        }
        btn.onclick = click;
    }

    eventListenerForButtonClose() {
        const btn = document.getElementById("btnCloseAdvancedSearch");
        const click = (event) => {
            event.preventDefault();
            this.close();
        }
        btn.onclick = click;

        const mouseover = (event) => {
            btn.style.backgroundImage = "url(" + imgCloseUpHover + ")";
        }
        btn.onmouseover = mouseover;

        const mouseout = (event) => {
            btn.style.backgroundImage = "url(" + imgCloseUp + ")";
        }
        btn.onmouseout = mouseout;
    }

    eventListenerForInputActor() {
        const inp = document.getElementById("actor");
        const change = (event) => {
            event.preventDefault();
            this.autocompileActor();
        }
        inp.oninput = change;
    }

    eventListenerForRadio(radiosToUnlock, radiosToLock) {
        const lock = (event) => {
            this.unlock(radiosToUnlock);
            this.lock(radiosToLock);
        }
        radiosToUnlock[0].onclick = lock;
        radiosToUnlock[1].onclick = lock;
    }

    eventListenerForRadioNotSort(radioNotSort, radiosToUnlock) {
        const unlock = (event) => {
            this.unlock(radiosToUnlock)
        }
        radioNotSort.onclick = unlock;
    }

    lock(radiosToLock) {
        radiosToLock[0].disabled = true;
        radiosToLock[1].disabled = true;
        radiosToLock[0].checked = false;
        radiosToLock[1].checked = false;
    }
    unlock(radiosToUnlock) {
        radiosToUnlock[0].disabled = false;
        radiosToUnlock[1].disabled = false;
    }
}

export default new AdvancedSearch();