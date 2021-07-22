<template>
        <form class="login__form" @submit.prevent="handleLogin">
            <div class="form__input">
                <label for="username">Username or Email</label>
                <input 
                v-model="user.identifier"
                name="username"
                type="text">
            </div>
            <div class="form__input">
                <label for="password">Password</label>
                <input 
                v-model="user.password"
                name="password"
                type="password">
            </div>
            <button class="btn-main" :disabled="loading">Login</button>
            <p v-if="message">{{message}}</p>
            <p v-if="success">{{success}}</p>
        </form>
</template>
<script>
import User from '../models/user'
export default {
    name: 'Login',
    data() {
        return {
            user: new User('', ''),
            loading: false,
            message: '',
            success: null,
        };
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn
        }
    },
    methods: {
        handleLogin() {
        this.$store.dispatch('auth/login', this.user).then(
            () => {
                this.success = 'Successfully logged in !'
            },
            (error) => {
                this.loading = false;
                this.message = (error.response && error.response.data) ||
                            error.message ||
                            error.toString()})
        }
    },
    created() {
        if (this.loggedIn) {
            this.$router.push({name: "Messages"})
        }
    }
}
</script>
<style lang="scss">
$bg: #251C3F;
$bg-lt: #312552;
$bg-dk: #191426;
$accent: #FF0044;
$text-main: #746399;
$text-secondary: #18191F;
.login__form {
    width: 300px;
    display: flex;
    flex-direction: column;
    background-color: lighten($text-main, 45%);
    padding: 2em 3em;
    border-radius: 0.5em;
    .form__input, input {
        width: 100%;
    }
    label {
        text-transform: uppercase;
        font-size: 0.55em;
        letter-spacing: 0.05em;
        font-weight: 700;
        display: block;
        margin-top: 1em;
        margin-bottom: 0.2em;
        color: $text-main;
    }
    input {
        border-radius: 0.5em;
        padding: 0.5em;
        border: 2px solid lighten($text-main, 48%);
        background-color: lighten($text-main, 48%);
        outline: none;
        &:active, &:focus {
            border-color: $text-main;
        }
    }
}
</style>