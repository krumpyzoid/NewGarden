<template>
    <section id="cart-page">
        <ul class="f-row cart-page__state-manager">
            <li @click="goToCart"><h1 class="cart-page__state-title cart-page__state-title--active">Votre panier <span>></span></h1></li>
            <li @click="goToInfo"><h1 class="cart-page__state-title cart-page__state-title--disabled">Vos informations <span>></span></h1></li>
            <li><h1 class="cart-page__state-title cart-page__state-title--disabled">Commande finalisée</h1></li>
        </ul>
        <div v-if="step==0">
            <div class="cart-page__grid">
                <div class="cart-page__cart-items">
                    <table class="cart-page__items-table">
                        <tr class="cart-page__items-table--header">
                            <th>Produit</th>
                            <th>Prix</th>
                            <th>Quantité</th>
                            <th>Sous-Total</th>
                        </tr>
                        <tr v-for="item in cart" v-bind:key="item" class="cart-page__items-table--row">
                            <td @click="removeItem(item)">X</td>
                            <td class="cart-page__item-image"><img :src="`http://localhost:1337${findProductById(produits, item.variation.produit).Photo[0].formats.thumbnail.url}`" alt=""></td>
                            <td class="cart-page__item-slot">
                                <div class="fw-5">
                                    {{ findProductById(produits, item.variation.produit).Nom }}
                                </div>
                                <div class="t-ref">
                                    REF: {{ item.variation.Reference }}
                                </div>
                            </td>
                            <td class="fw-5">{{ item.price }} €</td>
                            <td><div class="cart-page__item-actions"><span @click="changeCartItemQuantity(item, 1)">+</span> {{ item.quantity }} <span @click="changeCartItemQuantity(item, -1)">-</span></div></td>
                            <td class="fw-5">{{ (item.price * item.quantity).toFixed(2) }} €</td>
                        </tr>
                    </table>
                </div>
                <div class="cart-page__cart-total">
                    <h3>Total panier</h3>
                    <div class="f-row j-b"><h4>Total panier</h4><h4 class="fw-5">{{ cartTotal.toFixed(2) }} €</h4></div>
                    <div class="f-row j-b"><h4>Expédition</h4><h4 class="fw-5">{{ expedition }} €</h4></div>
                    <div class="f-row j-b"><h3>Total</h3><h3 class="fw-5">{{ (cartTotal + expedition).toFixed(2) }} €</h3></div>
                    <div class="f-row j-c mt-03">
                        <button class="btn btn-primary" @click=validateCart>Valider</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="step==1">
            <div class="cart-page__grid2">
                <div class="cart-page__form">
                    <form action="">
                        <div class="grid-2">
                            <div class="form-input">
                                <label for="">Prénom*</label>
                                <input type="text">
                            </div>
                            <div class="form-input">
                                <label for="">Nom*</label>
                                <input type="text">
                            </div>
                        </div>
                        <div class="grid-2">
                            <div class="form-input">
                                <label for="">Numéro et nom de rue*</label>
                                <input type="text">
                            </div>
                            <div class="form-input">
                                <label for="">Bâtiment, appartement, lot, etc.</label>
                                <input type="text">
                            </div>
                        </div>
                        <div class="grid-2">
                            <div class="form-input">
                                <label for="">Code postal*</label>
                                <input type="text">
                            </div>
                            <div class="form-input">
                                <label for="">Ville*</label>
                                <input type="text">
                            </div>
                        </div>
                        <div class="form-input">
                            <label for="">Téléphone*</label>
                            <input type="text">
                        </div>
                        <div class="form-input">
                            <label for="">E-mail*</label>
                            <input type="text">
                        </div>
                        <div class="form-input">
                            <label for="">Notes de commande</label>
                            <textarea type="text"></textarea>
                        </div>
                    </form>
                    <div class="f-row j-c">
                        <button class="btn btn-primary" @click.prevent="validateDetails">Valider</button>
                    </div>
                    
                </div>
                <div>
                    <Login v-if="!loggedIn"></Login>
                    <div class="cart-page__login mt-05">
                        <h3>Total panier</h3>
                        <div class="f-row j-b"><h4>Total panier</h4><h4 class="fw-5">{{ cartTotal.toFixed(2) }} €</h4></div>
                        <div class="f-row j-b"><h4>Expédition</h4><h4 class="fw-5">{{ expedition }} €</h4></div>
                        <div class="f-row j-b"><h3>Total</h3><h3 class="fw-5">{{ (cartTotal + expedition).toFixed(2) }} €</h3></div>
                    </div>
                    <div v-if="showpayment" class="cart-page__payment">
                        payment widget
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import Login from '../components/Login'
import axios from 'axios'
import authHeader from '../services/auth-header.js'
export default {
    components: {
        Login
    },
    setup() {
        
    },
    data() {
        return {
            step: 0,
            expedition: 7.90,
            showpayment: false
        }
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn
        },
        cart() {
            return this.$store.state.cart
        },
        produits() { 
            return this.$store.state.produits
        },
        cartTotal() {
            let total = 0
            for (let i=0; i<this.cart.length; i++) {
                total += (this.cart[i].quantity * this.cart[i].price)
            }
            return total
        }
    },
    methods: {
        findProductById(products, id) {
            var item = products.filter(obj => {
            return obj.id === id
            })
            console.log(item.Nom)
            return item[0]
        },
        removeItem(item) {
            item.quantity = 0
            var index
            for(var i = 0; i < this.cart.length; i++) {                    
                if (this.cart[i].Reference == item.Reference) {   
                    index = i;                                                              
                    break;                                            
                }
            }
            this.cart.splice(index, 1)
            if (this.loggedIn) axios.delete('http://localhost:1337/shopping-cart-items/' + item.id, { headers: authHeader() })
        },
        changeCartItemQuantity(item, value) {
            if (item.quantity == 0 && value == -1) {                                               // if the quantity = 0 & user presses again, remove item from list
                var index
                for(var i = 0; i < this.$store.state.cart.length; i++) {                    
                    if (this.$store.state.cart[i].Reference == item.Reference) {   
                        index = i;                                                              
                        break;                                                                    
                    }
                }
                this.$store.state.cart.splice(index, 1)
                if (this.loggedIn) axios.delete('http://localhost:1337/shopping-cart-items/' + item.id, { headers: authHeader() })
            }
            if (item.quantity + value >= 0) {
                item.quantity += value
                if (this.loggedIn) axios.put('http://localhost:1337/shopping-cart-items/' + item.id + '/quantity', item, { headers: authHeader() })
            }
        },
        goToCart() {
            this.step = 0;
            let titles = document.getElementsByClassName('cart-page__state-title')
            for (let i=1; i<titles.length; i++) {
                titles[i].classList.remove('cart-page__state-title--active')
                titles[i].classList.remove('cart-page__state-title--done')
                titles[i].classList.add('cart-page__state-title--disabled')
            }
            titles[0].classList.remove('cart-page__state-title--done')
            titles[0].classList.add('cart-page__state-title--active')
        },
        goToInfo() {
            this.step = 1;
            let titles = document.getElementsByClassName('cart-page__state-title')
            titles[0].classList.remove('cart-page__state-title--active')
            titles[1].classList.remove('cart-page__state-title--disabled')
            titles[1].classList.add('cart-page__state-title--active')
        },
        validateCart() {
            this.goToInfo()
            let titles = document.getElementsByClassName('cart-page__state-title')
            titles[0].classList.add('cart-page__state-title--done')
        },
        validateDetails() {
            this.showpayment = true;
        }
    }
}
</script>

<style lang="scss">
#cart-page {
    padding-top: 2em;
}
.cart-page__state-manager {
    justify-content: center;
    list-style-type: none;
    h1 {
        text-align: center;
        margin-bottom: 1em;
    }
    li {
        padding: 0 1em;
        span {
            margin-left: 1em;
        }
    }
}
.cart-page__state-title {
    position: relative;
    &--done {
        &:after {
            position: absolute;
            content: '✔️';
            top: 0.2em;
            font-size: 0.8em;
            right: 0.7em;
        }
    }
    &--disabled {
        color: rgb(194, 194, 194);
    }
    &--active {
        border-bottom: 2px solid black;
    }
}
.cart-page__grid {
    display: grid;
    grid-template-columns: 3fr 1fr;
}
.cart-page__grid2 {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2em;
}
.cart-page__cart-items {
    width: 100%;
    padding-right: 2em;
    border-right: 1px solid grey;
}
.cart-page__items-table {
    width: 100%;
}
.cart-page__cart-total {
    width: 100%;
    padding-left: 2em;
}
.cart-page__items-table--header {
    width: 100%;
    display: grid;
    grid-template-columns: 6fr 1fr 1fr 1fr;
    text-align: left;
}
.cart-page__items-table--row {
    width: 100%;
    display: grid;
    grid-template-columns: 0.5fr 50px 5fr 1fr 1fr 1fr;
    text-align: left;
    padding: 0.5em 0;
    td {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    
}
.cart-page__item-image {
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
    }
}
.cart-page__item-slot {
    padding-left: 0.8em;
}
.cart-page__item-actions {
    -webkit-user-select: none; /* Safari */        
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
    display: flex;
    flex-direction: row;
    span {
        cursor: pointer;
        display: block;
        width: 5px;
        padding: 0 1.2em 0 0.8em;
        text-align: center;
    }
}

.cart-page__login {
    padding: 0 1em;
    h1 {
        margin-bottom: 0;
    }
    button {
        margin-bottom: 0.5em;
    }
}
</style>