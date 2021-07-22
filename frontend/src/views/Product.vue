<template>
    <section id="product">
        <div class="product__container">
           <div class="product__image"><i class="icofont-heart"></i><img :src="product.Photo?`http://localhost:1337${product.Photo[0].url}`:''" alt=""></div>
            <div class="product__description">
                <h1>{{ product.Nom }}</h1>
                <h4>REF: {{ variant?variant.Reference:'' }}</h4>
                <span class="product__price">{{ variant?variant.Prix:'' }} {{ variant ? '€':''}}</span>
                <div v-if="product.tailles && product.tailles.length > 0">
                    <h3>Tailles:</h3>
                    <select class="mt-02 custom-select" name="product__dimensions" id="product__dimensions" v-model="taille" @Change="selectVariation">
                        <option v-for="taille in product.tailles" v-bind:key="taille.id" :value="taille.id" >{{ taille.taille }}</option>
                    </select>
                </div>
                <div v-if="product.dimensions && product.dimensions.length > 0">
                    <h3>Dimensions:</h3>
                    <select class="mt-02 custom-select" name="product__dimensions" id="product__dimensions" v-model="dimension" @Change="selectVariation">
                        <option v-for="dimension in product.dimensions" v-bind:key="dimension.id" :value="dimension.id" >{{ dimension.Dimension }}</option>
                    </select>
                </div>
                <div v-if="product.materials && product.materials.length > 0">
                <h3>Bois</h3>
                    <ul class="product__options mt-02">
                        <li v-for="mat in product.materials" v-bind:key="mat.id" v-bind:class="[mat.id == this.material?activeMaterialClass:'', product__option]" @click="selectMaterial(mat)"><img :src="mat.image?`http://localhost:1337${mat.image.url}`:''" alt=""></li>
                    </ul>
                    <p class="mt-02">Argousier: Bois noble cultivé en Occitanie, résistance de classe 5</p>
                </div>
                <h3>Description</h3>
                <p> {{ product.Description }}</p>
                <h3>Contenu</h3>
                {{ product.Contenu }} <br>
                <button @click="this.$store.dispatch('addToCart', cartItem)" class="btn btn-primary">Add to cart</button>
            </div> 
        </div>
        <div class="more-products mt-04">
            <h1>Voir également</h1>
            <div class="more-products__grid">
                <div class="shop__item">
                <img class="shop__item-img" src="" alt="">
                <div class="shop__item-description">
                  <h1>Planche</h1>
                  <p>Planche de 4m*1.20m, bois au choix, fourni avec membrane de soubassement</p>
                  <span class="shop__price"></span>
                  <button class="btn btn-primary mt-02">Détails</button>
                </div>
              </div>
              <div class="shop__item">
                <img class="shop__item-img" src="" alt="">
                <div class="shop__item-description">
                  <h1>Planche</h1>
                  <p>Planche de 4m*1.20m, bois au choix, fourni avec membrane de soubassement</p>
                  <span class="shop__price"></span>
                  <button class="btn btn-primary mt-02">Détails</button>
                </div>
              </div>
              <div class="shop__item">
                <img class="shop__item-img" src="" alt="">
                <div class="shop__item-description">
                  <h1>Planche</h1>
                  <p>Planche de 4m*1.20m, bois au choix, fourni avec membrane de soubassement</p>
                  <span class="shop__price"></span>
                  <button class="btn btn-primary mt-02">Détails</button>
                </div>
              </div>
              <div class="shop__item">
                <img class="shop__item-img" src="" alt="">
                <div class="shop__item-description">
                  <h1>Planche</h1>
                  <p>Planche de 4m*1.20m, bois au choix, fourni avec membrane de soubassement</p>
                  <span class="shop__price"></span>
                  <button class="btn btn-primary mt-02">Détails</button>
                </div>
              </div>
            </div>
        </div>
        
    </section>
</template>

<script>
import axios from 'axios'
import ShoppingCartItem from '../models/shoppingcartitem.js'

export default ({
    data() {
        return {
            product: {},
            materials: [],
            variant: {},
            material: 0,
            dimension: 0,
            taille: '',
            cartItem: new ShoppingCartItem(1, '', '', ''),
            activeMaterialClass: 'product__option--active',
            product__option: 'product__option'
        }
    },
    computed: {
        produits() { 
        return this.$store.state.produits
        }
    },
    methods: {
        async fetchProduct() {
            axios.get('http://localhost:1337/produits/' + this.$route.params.id)
                .then((res) => {
                    this.product = res.data;
                    if (this.product.materials.length > 0) this.material = this.product.materials[0].id
                    if (this.product.dimensions.length > 0) this.dimension = this.product.dimensions[0].id
                    if (this.product.tailles.length > 0) this.taille = this.product.tailles[0].id
                    this.selectVariation()
                })                                                                   // Store the API response data into local storage                                                                        
                 // Execute function to pick the product variant from default options                                             // Reverse materials order***
        },
        initializeMaterial() {
            const boxes = document.getElementsByClassName('product__option');
            boxes[0].classList.add('product__option--active')
        },
        selectMaterial(material) {
            this.material = material.id
            this.selectVariation()
        },
        selectVariation() {
            let variantarray = this.product.variations
            if (this.product.dimensions.length > 0) variantarray = variantarray.filter( obj => obj.dimension === this.dimension)     
            if (this.product.materials.length > 0) variantarray = variantarray.filter( obj => obj.material === this.material)
            if (this.product.tailles.length > 0) variantarray = variantarray.filter( obj => obj.taille === this.taille)
            this.variant = variantarray[0]
            
            this.cartItem.variation = this.variant.id
            this.cartItem.price = this.variant.Prix                                                                                                                       // to be able to display data and store into cart
        },
    },
    mounted() {
        this.fetchProduct();
    }
})
</script>

<style lang="scss">
#product {margin-top: 1em}
.product__container {
    display: flex;
    flex-direction: row;
    h3 {
        margin-top: 1em;
    }
    p {
        color: black;
    }
}
.product__image {
    position: relative;
    width: 400px;
    height: 500px;
    background-color: blue;
    flex-shrink: 0;
    overflow: hidden;
    img {
        height: 100%;
    }
    i {
        position: absolute;
        top: 1em;
        right: 1em;
        color: white;
        opacity: 0.3;
        font-size: 1.5em;
        &:hover {
            opacity: 1;
        }
    }
}
.product__description {
    padding-left: 2em;
    button {
        margin-top: 2em;
    }
}
.product__options {
    list-style-type: none;
    display: flex;
    flex-direction: row;
}
.product__option {
    width: 50px;
    height: 50px;
    border-radius: 0.7em;
    background-color: blue;
    margin-right: 1em;
    border: 2px solid white;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
    }
}
.product__option--active {
    border-color: lightblue;
}
.product__contains {
    font-size: 0.9em;
    margin-left: 1em;
}
.product__price {
    font-size: 2em;
}
.more-products__grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    column-gap: 10px;
}
</style>