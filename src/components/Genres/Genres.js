import { PATH, KEY, RUS } from "../../constants/api";
import { getDataApi } from "../../utils/getDataApi";

class Genres {
    _data = null;
    _url = PATH.CONFIGURATION_GENRES;
    _param = {
        api_key: KEY,
        language: RUS,
    }
    async getGenres() {
        let data = await getDataApi.getData(this._url, { params: this._param });
        this._data = data.data.genres;
    }

    get data() {
        return this._data;
    }
}

export default new Genres();