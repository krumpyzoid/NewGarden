<template>
<section id="home">
  <div v-if="this.$route.path=='/'" id="intro" class="scroll-snap">
    <div class="intro__content">
      <i class="icofont-leaf"></i>
      <h1>NewGarden</h1>
      <h2 class="mt-01">Des outils pour les petits et grands jardins</h2>
      <button class="btn btn-white mt-04">Découvrir</button>
    </div>
  </div>
  <div id="content scroll-snap">
    <div class="container">
      <transition name="fade">
      <div v-if="displayCart" class="shopping-cart__wrapper" :style='{ left: cartLeftDistance + "px"}'>
        <span class="shopping-cart__close" @click="toggleCart">X</span>
        <div class="shopping-cart__items">
          <div v-for="item in cart" v-bind:key="item.name" class="shopping-cart__item">
            <div class="shopping-cart__item-name">
              <h3>{{ findProductById(produits, item.variation.produit).Nom }}</h3>
              <h4>REF: {{item.variation.Reference}}</h4>
              <span class="shopping-cart__price">{{ (item.quantity * item.price).toFixed(2)}} €</span>
            </div>
            <div class="shopping-cart__actions">
              <span @click="changeCartItemQuantity(item, 1)">+</span>
              {{item.quantity}}
              <span @click="changeCartItemQuantity(item, -1)">{{ item.quantity>0?'-':'Supprimer' }}</span>
            </div>
          </div>
        </div>
      <div class="shopping-cart__total">
        <h3>Total: {{ cartTotal.toFixed(2) }} €</h3>
        <button class="btn btn-primary">Commander</button> <router-link to="/cart"><button class="btn btn-primary">Voir le panier</button></router-link>
      </div>
      
      </div>
      </transition>
      <nav class="nav__main-nav">
        <div class="row">
          <div class="nav__brand">
            <i class="icofont-leaf"></i> 
            <h1>NewGarden</h1>
          </div>
          <div class="nav__rightnav">
            <span class="notification__badge">
              <i class="icofont-cart" @click="toggleCart"></i>
              <span v-if="numberOfCartItems>0" class="notification__badge-badge">{{ numberOfCartItems }}</span>
            </span>
            <i class="icofont-heart"></i>
            <i class="icofont-tack-pin"></i>
            <div v-if="loggedIn" class="nav__connected">
              <p>Bonjour <span class="nav__connected-user">{{ user.username }}</span></p>
              <p class="subtext">Comment allez vous ce Jeudi 10 Juin ?</p>
            </div>
          </div>
          
        </div>
        <ul class="nav__nav-items">
          <router-link to="/"><li class="nav__nav-item">Accueil</li></router-link>
          <router-link to=""><li class="nav__nav-item">Boutique <i class="icofont-simple-down"></i></li></router-link>
          <router-link to=""><li class="nav__nav-item">Que faire au jardin ?</li></router-link>
          <router-link to=""><li class="nav__nav-item">Organiser son potager</li></router-link>
          <router-link to=""><li class="nav__nav-item">Ressources <i class="icofont-simple-down"></i></li></router-link>
          <router-link to=""><li class="nav__nav-item">Contact</li></router-link>
        </ul>
        </nav>
        <router-view/>
    </div>
  </div>
  <div id="footer" class="scroll-snap">

  </div>
</section>
</template>
<script>
import UserService from './services/user.service.js'
import axios from 'axios'
import authHeader from './services/auth-header.js'
export default ({
  data() {
    return {
      displayCart: false,
      cartLeftDistance: 0,
      user: {}
      }
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn
    },
    cart() {
      return this.$store.state.cart
    },
    numberOfCartItems() {
      return this.$store.state.cart.length
    },
    produits() { 
      return this.$store.state.produits
    },
    cartTotal() {
      let total = 0;
      for (let i = 0; i < this.cart.length; i++) {
        total = total + this.cart[i].price * this.cart[i].quantity
      }
      return total
    }
  },
  methods: {
    findProductById(products, id) {
      var item = products.filter(obj => {
      return obj.id === id
      })
      return item[0]
    },
    toggleCart() {
      this.displayCart?this.displayCart=false:this.displayCart=true
    },
    calculateCartCoordinates() {
      var element = document.getElementsByClassName('notification__badge')[0]
      var rect = element.getBoundingClientRect();
      this.cartLeftDistance = rect.left;
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
    getUserMe() {
      if (this.loggedIn) {
        UserService.getMe()
          .then(res => this.user = res)
      }
      console.log(this.user)
    }
  },
  mounted() {
    this.getUserMe()
    this.calculateCartCoordinates()
    this.$store.dispatch('getProduits')
    this.$store.dispatch('initializeCart')
  },
  created() {
    window.addEventListener('resize', this.calculateCartCoordinates)
  },
  unmounted() {
    window.removeEventListener('resize', this.calculateCartCoordinates)
  },
})
</script>


<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/*           IMPORTS               */
@import url('https://fonts.googleapis.com/css2?family=Red+Hat+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,500;1,700;1,900&family=Redressed&display=swap');
@import url('./assets/icofont/icofont.min.css');

/*           VARIABLES             */
$main: #161E1B;
$text: #434D48;

/*           HTML RESET            */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/*          LAYOUT HELPERS         */
.mt-01 {margin-top: 0.15em;}
.mt-02 {margin-top: 0.5em;}
.mt-03 {margin-top: 0.75em;}
.mt-04 {margin-top: 1.5em;}
.mt-05 {margin-top: 2em;}
.container {
  position: relative;
  width: 100%;
  max-width: 1140px;
  padding: 0 1em;
  margin: 0 auto;
}
.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  }
.fw-1 {font-weight: 100}
.fw-3 {font-weight: 300}
.fw-5 {font-weight: 500}
.fw-7 {font-weight: 700}
.f-row {display: flex; flex-direction: row;}
.j-r {justify-content: flex-end;}
.j-b {justify-content: space-between;}
.j-c {justify-content: center;}
/*           TYPOGRAPHY            */
* {
  font-family: 'Red Hat Display', sans-serif;
  color: $main;
}
.subtext {
  font-size: 0.7em;
}
h1 {
  font-size: 2em;
  font-weight: 900;
}
h2 {
  font-family: 'Redressed', cursive;
}

p {
  color: $text;
}
a {
  text-decoration: none;
}
.t-c {text-align: center;}
.t-ref {
  font-size: 0.7em;
  color: grey;
}
/*    **************************    */
/*             BLOCKS               */
/*    **************************    */
/*             1.Intro              */

#intro {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url('./assets/introbg.jpg');
  background-size: cover;
  h1, h2, i {
    color: white;
  }
  h1 {
    font-size: 4em;
    line-height: 0.8em
  }
  h2 {
    font-size: 1.4em;
    font-weight: 100;
  }
  i {
    font-size: 7em;
    line-height: 0.7em;
  }
}

.intro__content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/*             2.Mozaique              */
.mozaique__row1 {
  display: grid;
  grid-template-columns: 1fr 2fr;
}
.mozaique__row2 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin-top: 10px;
}

.mozaique__item {
  width: 100%;
  height: 300px;
  padding: 0 5px;                                   /* Forced padding to align items properly */
}
.mozaique__item:nth-of-type(1) {padding-left: 0;}   /* Reset left padding */
.mozaique__item:last-of-type {padding-right: 0;}    /* Reset right padding */

.mozaique__item-content {                           /* This is where the content actually gets displayed */
  position: relative;
  height: 100%;
  width: 100%;
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2em;
  overflow: hidden;
  h1 {
    z-index: 2;
    color: white;
    text-align: center;
    font-weight: 600;
  }
  img {
    position: absolute;
    z-index: 1;
    width: 100%;
    top: 0;
    left: 0;
  }
}

/*              3.Shop               */
#shop {
  margin-top: 2em;
}
.shop__grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 10px;
  margin-top: 1.2em;
}
.shop__item-img {
  width: 100%;
  height: 350px;
  background-color: blue;
}
.shop__item-description {
  padding: 0 0.5em;
}
.shop__price {
  margin-top: 0.2em;
  display: block;
  font-size: 1.8em;
  font-weight: 300;
}

/*    ***************************    */
/*             ELEMENTS              */
/*    ***************************    */
/*             1.Main-nav            */
.nav__main-nav {
  z-index: 10000000;
  position: sticky;
  top: 0;
  color: $main;
  padding: 1em 0;
  background-color: white;
  .row {
    justify-content: space-between;
    .nav__brand {
      justify-self: start;  
    }
  }
}
.nav__rightnav {
  display: flex;
  flex-direction: row;
  align-items: center;
  i {
    cursor: pointer;
    font-size: 2em;
    margin-right: 1em;
  }
}
.nav__nav-items {
  margin-top: 0.5em;
  list-style-type: none;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
}
.nav__brand {
  display: flex;
  flex-direction: row;
  align-items: center;
  h1 {
    font-size: 2em;
    font-weight: 900;
  }
  i {
    font-size: 3.5em;
    margin-right: 0.1em;
  }
}
.nav__connected-user {
  text-decoration: underline;
  font-weight: 500;
}
.links {
  font-size: 0.7em;
  opacity: 0.5;
  cursor: pointer;
  &+ .links {
    margin-left: 1em;
  }
  &:hover {
    opacity: 1;
  }
}
/*            2.Footer               */
#footer {
  height: 400px;
  background-color: $main;
  margin-top: 2em;
}
/*              3.Cart               */
.shopping-cart__wrapper {
  transition: 0.5s;
  position: fixed;
  z-index: 100000000;
  top: 6em;
  width: 380px;
  background-color: rgb(240, 239, 239);
  padding-top: 1em;
}
.shopping-cart__items {
  max-height: 300px;
  overflow-y: scroll;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;
}
.shopping-cart__items::-webkit-scrollbar {
  display: none;
}
.shopping-cart__item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1em 2em;
}
.shopping-cart__price {
  font-size: 1.5em;
}
.shopping-cart__actions {
  font-weight: 700;
  font-size: 1em;
  user-select: none;
}
.shopping-cart__actions span {
  padding: 0.3em;
  cursor: pointer;
}
.shopping-cart__close {
  position: absolute;
  cursor: pointer;
  right: 0.5em;
  top: 0.3em;
}
.shopping-cart__total {
  text-align: center;
  padding: 1em 0;
  button {
    margin-top: 0.5em;
  }
}
/*             BUTTONS               */
.btn {
  padding: 0.5em 3.5em;
  border-radius: 2em;
  font-size: 0.7em;
  font-weight: 500;
  letter-spacing: 0.05em;
  border: 2px solid red;
  cursor: pointer;
  transition: 0.5s;
  &:hover {
    letter-spacing: 0.3em;
  }
}
.btn-white {
  color: $main;
  background-color: white;
  border-color: white;
}
.btn-primary {
  color: white;
  background-color: $main;
  border-color: $main;
}

.notification__badge {
  position: relative;
}
.notification__badge-badge {
  position: absolute;
  right: 2.4em;
  top: 0;
  border-radius: 50%;
  background-color: rgb(204, 87, 52);
  color: white;
  font-size: 0.6em;
  height: 1.8em;
  width: 1.8em;
  text-align: center;
  padding-top: 0.2em;
  font-weight: 500;}

  .fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  }
  /*             FORMS               */
  .form-row {
    display: flex;
    flex-direction: row;
  }
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1em;
  }
  input, textarea {
    display: block;
    width: 100%;
    padding: 0.5em;
    margin-top: 0.5em;
    margin-bottom: 1em;
    border-radius: 0.2em;
    border: 1px solid lighten($main, 60%);
  }
  label {
    color: $main;
    font-weight: 500;
    font-size: 0.8em;
    letter-spacing: 0.1em;
  }
</style>
