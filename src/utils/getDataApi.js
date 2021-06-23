import axios from "axios";

class GetDataApi {
    async getData(url, param) {
        try {
            const response = await axios.get(url, param);
            return response;
        } catch (error) {
            console.log(error.massage);
            return false;
        }
    }
}

export const getDataApi = new GetDataApi();