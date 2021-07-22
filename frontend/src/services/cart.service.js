import axios from "axios"
import authHeader from "./auth-header"
const API_URL = 'http://localhost:1337/shopping-cart-items/'

class ShoppingCartItemsService {
    getCart(userid) {
        return axios.get(API_URL, { headers: authHeader() })
            .then(res => {
                return res.data.filter(item => item.users_permissions_user.id == userid)
            });
    }
    editOne(userid, id, newmessage) {
        return axios.get(API_URL + id, newmessage, { headers: authHeader() })
            .then(res => {
                return res.data
            });
    }
}

export default new ShoppingCartItemsService()