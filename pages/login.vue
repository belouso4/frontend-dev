<template>
  <section class="main-section auth-section">
    <div class="container">
      <form action="" class="form-auth" @submit.prevent="login">
        <h1>Авторизация</h1>
        <label for="">
          Email
          <input id="login-email" v-model="form.email" type="text" placeholder="Введите email">
          <p v-if="!validations.email.valid" class="error-msg">{{ validations.email.message }}</p>
        </label>
        <label for="">
          Пароль
          <div>
            <input id="login-password" class="eye" v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="Введите пароль">
            <i @click="showPass = !showPass" :class="[showPass ? 'fas fa-eye' : 'fas fa-eye-slash' ]"></i>
          </div>
          <p v-if="!validations.password.valid" class="error-msg">{{ validations.password.message }}</p>
          <p v-if="!validations.invalidLogin.valid" class="error-msg">{{ validations.invalidLogin.message }}</p>
        </label>
        <div class="form-auth_footer d-flex">
          <nuxt-link to="/forgot-password">Забыли пароль?</nuxt-link>
          <button>Войти</button>
        </div>

      </form>
    </div>
  </section>
</template>

<script>
    export default {
        middleware: 'guest',
        layout: 'AppMain',
        data(){
            return {
                form: {
                    email: '',
                    password: ''
                },
                validations: {
                    email: {
                        valid: true,
                        message: ''
                    },
                    password: {
                        valid: true,
                        message: ''
                    },
                    invalidLogin: {
                        valid: true,
                        message: ''
                    }
                },
                showPass: false,
                errorMessage: ''
            }
        },
      created() {
        console.log(process.env.API_BASE_URL)
      },
      methods: {
            validateLogin(){

                if( this.form.email == ''
                    || !this.form.email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) ){
                    this.validations.email.valid = false;
                    this.validations.email.message = 'Необходимо ввести корректныую электронную почту.'
                }else{
                    this.validations.email.valid = true;
                    this.validations.email.mesage = '';
                }
                if( this.form.password == ''){
                    this.validations.password.valid = false;
                    this.validations.password.message = 'Необходимо ввести пароль'
                }else{
                    this.validations.password.valid = true;
                    this.validations.password.message = '';
                }
                return (
                    this.validations.email.valid &&
                    this.validations.password.valid
                ) ? true : false;
            },
            async login(){
                if( this.validateLogin() ){
                  try {
                    await this.$auth.loginWith( 'laravelSanctum', {
                      data: {
                        email: this.form.email,
                        password: this.form.password,
                      }
                    })

                     this.$router.push('/')
                  } catch (e) {
                    console.log(e)
                    this.validations.invalidLogin.valid = false;
                    this.validations.invalidLogin.message = 'Неверные учетные данные, пожалуйста, повторите попытку!';
                    this.validations.email.valid = true;
                    this.validations.password.valid = true;
                  }
                }
            },
        }
    }
</script>

<style>
 .form-auth_footer a {
   display: block;
   cursor: pointer;
 }
</style>
