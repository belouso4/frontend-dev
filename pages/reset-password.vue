<template>
  <section class="main-section auth-section">
    <div class="container">
      <form action="" class="form-auth" @submit.prevent="resetPassword()">
        <h1>Авторизация</h1>
        <label for="">
          Email
          <input id="login-email" v-model="form.email" type="text" placeholder="Введите email">
        </label>

        <label for="">
          Пароль
          <div>
            <input class="eye" v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="Введите пароль">
            <i @click="showPass = !showPass" :class="[showPass ? 'fas fa-eye' : 'fas fa-eye-slash' ]"></i>
          </div>
          <Meter :value="passwordStrength"></Meter>
        </label>
        <label for="">
          Повторите пароль
          <div>
            <input class="eye" v-model="form.confirm_password" :type="showPass ? 'text' : 'password'" placeholder="Введите пароль повторно">
          </div>
        </label>

        <div class="form-auth_footer d-flex">
          <button>Отправить инструкции по сбросу</button>
        </div>

      </form>
    </div>
  </section>
</template>

<script>
import zxcvbn from "zxcvbn";

export default {
  middleware: 'guest',
  layout: 'AppMain',
  data(){
    return {
      showPass: false,
      form: {
        email: '',
        password: '',
        confirm_password: '',
        token: this.$route.query.token
      },
    }
  },

  computed: {
    passwordStrength () {
      return zxcvbn(this.form.password).score
    },
  },

  methods: {
    async resetPassword() {
      console.log('-----')
      try {
        await this.$axios.post('/v1/reset-password', this.form)
        this.$router.push({path: '/login'})
      } catch (err) {

      }
    },

  }
}
</script>

<style>

</style>
