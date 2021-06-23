import axios from "axios";

class PostDataApi {
    async postData(url, param) {
        try {
            const response = await axios.post(url, param);
            return response;
        } catch (error) {
            console.log(error.massage);
            return false;
        }
    }
}

export const postDataApi = new PostDataApi();