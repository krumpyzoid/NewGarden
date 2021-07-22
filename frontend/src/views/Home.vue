<template>
<section id="home">
  <section id="mozaique">
          <div class="mozaique">
            <div class="mozaique__row1">
              <div class="mozaique__item"><div class="mozaique__item-content"><img src="https://images.unsplash.com/photo-1594879412187-aef8d31418c7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2134&q=80" alt=""><h1>Guide des semis et plantations</h1></div></div>
              <div class="mozaique__item"><div class="mozaique__item-content"><img src="../assets/moza_planches.jpg" alt=""><h1>Bacs de culture en bois</h1></div></div>
            </div>
            <div class="mozaique__row2">
              <div class="mozaique__item"><div class="mozaique__item-content"><img src="https://images.unsplash.com/photo-1594879412187-aef8d31418c7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2134&q=80" alt=""><h1>Promotions</h1></div></div>
              <div class="mozaique__item"><div class="mozaique__item-content"><img src="https://images.unsplash.com/photo-1594879412187-aef8d31418c7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2134&q=80" alt=""><h1>Equipement</h1></div></div>
              <div class="mozaique__item"><div class="mozaique__item-content"><img src="https://images.unsplash.com/photo-1594879412187-aef8d31418c7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2134&q=80" alt=""><h1>Outils</h1></div></div>
            </div>
          </div>
      </section> 
      <section id="shop">
          <div v-for="category in categories" v-bind:key="category.name" class="shop__category mt-05">
            <h1>{{ category.title }}</h1>
            <p>{{ category.description }}</p>
            <div class="shop__grid">
              <div v-for="product in category.produits" v-bind:key="product.Nom" class="shop__item">
                <img class="shop__item-img" :src='`http://localhost:1337${product.Photo[0].url}`' alt="">
                <div class="shop__item-description"><h1>{{ product.Nom }}</h1>
                <p>{{ product.Description }}</p>
                <span class="shop__price">{{ product.prix }} €</span>
                <router-link :to="`/produits/${product.id}`"><button class="btn btn-primary mt-02">Détails</button></router-link></div>
              </div>
            </div>
          </div>
      </section>
</section>
  
</template>

<script>
// @ is an alias to /src
import axios from 'axios';

export default {
  name: 'Home',
  data() {
    return {
      products: [],
      categories: []
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
    redirectToDetails() {
      this.$router.push('/produits/test')
    },
    async fetchProducts() {
      const products = await axios.get('http://localhost:1337/produits')
      this.products = products.data
      console.log(this.products)
    },
    fetchCategories() {
      axios.get('http://localhost:1337/categories')
          .then(res => this.categories = res.data)
    }
  },
  mounted() {
    this.fetchCategories();
    this.fetchProducts();
  }
}
</script>

<style lang="scss">
/*           IMPORTS               */
@import url('https://fonts.googleapis.com/css2?family=Red+Hat+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,500;1,700;1,900&family=Redressed&display=swap');
@import url('../assets/icofont/icofont.min.css');

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
h4 {
  font-size: 0.7em;
}
p {
  color: $text;
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
  background-image: url('../assets/introbg.jpg');
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
</style>