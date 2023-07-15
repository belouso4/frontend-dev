<template>
  <section class="main-section auth-section">
    <div class="container">
      <form action="" class="form-auth" @submit.prevent="resetPassword()">
        <h1>Сброс пароля</h1>
        <form-group :validator="$v.form.email" label="Email">
          <input id="login-email" v-model="form.email" type="text" placeholder="Введите email">
        </form-group>
        <form-group :validator="$v.form.password" label="Пароль">
          <div>
            <input class="eye" v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="Введите пароль">
            <i @click="showPass = !showPass" :class="[showPass ? 'fas fa-eye' : 'fas fa-eye-slash' ]"></i>
          </div>
          <Meter :value="passwordStrength"></Meter>
        </form-group>
        <form-group :validator="$v.form.confirm_password" label="Повторите пароль">
          <input class="eye" v-model="form.confirm_password" :type="showPass ? 'text' : 'password'" placeholder="Введите пароль повторно">
        </form-group>

        <div class="form-auth_footer d-flex">
          <button-loader :loading="loading">Изменить данные</button-loader>
        </div>

      </form>
    </div>
  </section>
</template>

<script>
import zxcvbn from "zxcvbn";
import {email, maxLength, minLength, required, sameAs} from "vuelidate/lib/validators";
import ButtonLoader from "../components/Ui/ButtonLoader.vue";

export default {
  middleware: 'guest',
  components: {ButtonLoader},
  layout: 'AppMain',
  data(){
    return {
      showPass: false,
      loading: false,
      form: {
        email: '',
        password: '',
        confirm_password: '',
        token: this.$route.query.token
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
        confirm_password: {
          sameAsPassword: sameAs('password')
        },
      }

    }
  },

  computed: {
    passwordStrength () {
      return zxcvbn(this.form.password).score
    },
  },

  methods: {
    async resetPassword() {
      this.$v.$touch()
      if (this.$v.$invalid) return
      this.loading = true

      try {
        await this.$axios.post('/v1/reset-password', this.form)
        await this.$router.push({path: '/login'})

        this.$v.$reset()
      } catch (err) {console.log(err)}

      this.loading = false
    },

  }
}
</script>

<style>

</style>
