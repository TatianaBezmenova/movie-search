import axios from "axios";

class DeleteDataApi {
    async deleteData(url, param) {
        try {
            const response = await axios.delete(url, param);
            return response;
        } catch (error) {
            console.log(error.massage);
            return false;
        }
    }
}

export const deleteDataApi = new DeleteDataApi();