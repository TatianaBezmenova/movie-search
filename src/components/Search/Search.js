import { KEY, PATH, RUS } from "../../constants/api";
import Movie from "../Movie"
import { ROOT_ACCOUNT, ROOT_INDEX } from "../../constants/root";

class Search {
    async render() {
        ROOT_INDEX.innerHTML = "";
        ROOT_ACCOUNT.innerHTML = "";
        const query = document.getElementById("inpGlobalSearch").value;
        Movie._param = {
            api_key: KEY,
            query: query,
            page: 1,
            language: RUS,
        };
        Movie._url = PATH.SEARCH_MOVIE;
        await Movie.render();
        Movie.eventListener();
    }

    eventListener() {
        const btn = document.getElementById("btnGlobalSearch");
        const click = (event) => {
            event.preventDefault();
            this.render();
        }
        btn.onclick = click;
    }
}

export default new Search();