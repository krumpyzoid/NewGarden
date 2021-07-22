import axios from "axios"
import authHeader from "./auth-header"
const API_URL = 'http://localhost:1337/users/'

class UserService {
    getAll() {
        return axios.get(API_URL, { headers: authHeader() })
            .then(res => {
                return res.data
            });
    }
    getMe() {
        return axios.get(API_URL + 'me', { headers: authHeader() })
            .then(res => {
                return res.data
            });
    }
    editOne(id, newmessage) {
        return axios.get(API_URL + id, newmessage, { headers: authHeader() })
            .then(res => {
                return res.data
            });
    }
}

export default new UserService()