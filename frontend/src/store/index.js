import { createStore } from 'vuex'
import axios from "axios"
import ShoppingCartItemsService from '../services/cart.service.js'
import { auth } from './auth.module'
import authHeader from "../services/auth-header"

const user = JSON.parse(localStorage.getItem('user'));

export default createStore({
  state: {
    cart: [],
    produits: [],
    cartTotal: 0
  },
  mutations: {
    addToCart(state, payload) {
      state.cart.push(payload)
    },
    get_produits(state, payload) {
      state.produits = payload
    },
    changeTotal(state, payload) {
      state.cartTotal += payload;
    },
    initializeCart(state, payload) {
      state.cart = payload
    }
  },
  actions: {
    initializeCart({ commit }){
      if (user) {
        ShoppingCartItemsService.getCart(user.user.id)
          .then(res => {
            commit('initializeCart', res)
          })
      }
    },
    getProduits({ commit }) {
      axios.get('http://localhost:1337/produits')
          .then(response => {
          commit('get_produits', response.data)
      })
    },
    addToCart({ commit }, cartItem) {   
      var found = false;                                                                // Setup "found" variable (will be set to true if found in the search loop)
      var index;                                                                        // Setup index out of the loop
      for(var i = 0; i < this.state.cart.length; i++) {                                 // Loop through cart in the vuex store
        if (this.state.cart[i].variation.id == cartItem.variation) {   //    'if the reference of the array item is the same as the one from the selected product'
            found = true;                                                               //    'set found to true'
            index = i;                                                                  //    'store the index value'
            break;                                                                      //    'stop running the search function'
        }
      }
      if (found) {                                                                      // if it exists
        if (user) {
          console.log('we are here')
          const newObject = this.state.cart[index]
          newObject.quantity += 1
          axios.put('http://localhost:1337/shopping-cart-items/' + this.state.cart[index].id + '/quantity', newObject, { headers: authHeader() })
        }
      } else {
        if (user) {
          console.log({ ...cartItem, Users_permissions_user: user.user.id })
          axios.post('http://localhost:1337/shopping-cart-items', { ...cartItem, users_permissions_user: user.user.id }, { headers: authHeader() })
          .then((res) => commit('addToCart', res.data))
        } else {
          commit('addToCart', { ...cartItem, user: 'guest' })                  // if it doesnt, add item to cart
        }
      }
  }
  },
  modules: {
    auth
  }
})
