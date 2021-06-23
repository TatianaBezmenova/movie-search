import { PATH, KEY } from "../../constants/api";
import { getDataApi } from "../../utils/getDataApi";

import "./ImageConfig.css"

class ImageConfig {
    _config = null;
    _url = PATH.CONFIGURATION_IMAGE;
    _param = {
        api_key: KEY,
    };

    async getImageConfig() {
        let data = await getDataApi.getData(this._url, { params: this._param });
        data = JSON.parse(data.request.response).images;

        this._config = {
            baseUrl: data.base_url,
            posterSize: data.poster_sizes[2],
            bigPosterSize: data.poster_sizes[3],
            backdropSize: data.backdrop_sizes[1],
            profileSizes: data.profile_sizes[1],
        }
    }

    set config(value) {
        this._config = value;
    }

    get config() {
        return this._config;
    }
}

export default new ImageConfig();