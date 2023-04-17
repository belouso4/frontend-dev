<template>
  <section class="main-section auth-section">
    <div class="container">
      <form action="" class="form-auth" @submit.prevent="login">
        <h1>Авторизация</h1>
        <p v-if="typeof errorMsg === 'string'">{{ errorMsg }}</p>
        <p v-else v-for="error in errorMsg">{{ error[0] }}</p>
        <form-group :validator="$v.form.email" label="Email">
          <input type="text" v-model="form.email" placeholder="Введите email">
        </form-group>

        <form-group :validator="$v.form.password" label="Пароль">
          <div>
            <input class="eye" v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="Введите пароль">
            <i @click="showPass = !showPass" :class="[showPass ? 'fas fa-eye' : 'fas fa-eye-slash' ]"></i>
          </div>
        </form-group>

        <div class="form-auth_footer d-flex align-items-center">
          <nuxt-link to="/forgot-password">Забыли пароль?</nuxt-link>
          <button>
            <span v-if="!loading">Войти</span>
            <Loader style="display: inline-block;" v-else width="20px"/>
          </button>
        </div>

      </form>
    </div>
  </section>
</template>

<script>
import {email, maxLength, minLength, required, sameAs} from "vuelidate/lib/validators";

export default {
  middleware: 'guest',
  layout: 'AppMain',
  data(){
    return {
      loading: false,
      showPass: false,
      errorMsg: '',
      form: {
        email: '',
        password: ''
      },
    }
  },

  validations() {
    return {
      form: {
        email: {
          required,
          email,
          maxLength: maxLength(255)
        },
        password: {
          required,
          minLength: minLength(6),
          maxLength: maxLength(255)
        },
      }
    }
  },

  methods: {
    async login(){
      this.$v.$touch()

      if (this.$v.$invalid) return
      this.loading = true

      try {
        await this.$auth.loginWith( 'laravelSanctum', {
          data: {
            email: this.form.email,
            password: this.form.password,
          }
        })
        await this.$router.push('/')

        this.$v.$reset()
      } catch (err) {this.setErrorMsg(err)}

      this.loading = false
    },

    setErrorMsg(err) {
      const code = parseInt(err.response && err.response?.status)

      if (code === 403) {
        this.errorMsg = err.response.data.error
      } else if (code === 422) {
        this.errorMsg = err.response.data.errors
      } else {
        this.errorMsg = 'неизвестная ошибка'
      }
    }
  }
}
</script>

<style>
.align-items-center {
  align-items: center;
}
 .form-auth_footer a {
   display: block;
   cursor: pointer;
 }

 .form-auth_footer button {
   transition: width 1s ease-in, height 1s ease-in;
   height: 35px;
   max-width: 150px;
   width: 100%;
   min-width: max-content;
 }

</style>
