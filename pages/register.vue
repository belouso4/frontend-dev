<template>
  <section class="main-section auth-section">
    <div class="container">
      <form action="" class="form-auth" @submit.prevent="register">
        <h1>Регистрация</h1>
        <p v-if="typeof errorMsg === 'string'">{{ errorMsg }}</p>
        <p v-else v-for="error in errorMsg">{{ error[0] }}</p>
        <form-group :validator="$v.form.name" label="Имя">
          <input type="text" v-model="form.name" placeholder="Введите имя">
        </form-group>

        <form-group :validator="$v.form.email" label="Email">
          <input type="text" v-model="form.email" placeholder="Введите email">
        </form-group>
        <form-group :validator="$v.form.password" label="Пароль">
          <div>
            <input class="eye" v-model="form.password" :type="showPass ? 'text' : 'password'" placeholder="Введите пароль">
            <i @click="showPass = !showPass" :class="[showPass ? 'fas fa-eye' : 'fas fa-eye-slash' ]"></i>
          </div>
          <Meter :value="passwordStrength"></Meter>
        </form-group>
        <form-group :validator="$v.form.confirm_password" label="Имя">
          <div>
            <input class="eye" v-model="form.confirm_password" :type="showPass ? 'text' : 'password'" placeholder="Введите пароль повторно">
          </div>
        </form-group>

        <div class="form-auth_footer d-flex align-items-center">
          <nuxt-link to="/login">Уже есть аккаунт?</nuxt-link>
          <button-loader :loading="loading">Зарегистрироваться</button-loader>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import zxcvbn from 'zxcvbn'
import Meter from "../components/Meter";
import {email, maxLength, minLength, required, sameAs} from "vuelidate/lib/validators";
import ButtonLoader from "../components/Ui/ButtonLoader.vue";

export default {
  middleware: 'guest',
  components: {Meter, ButtonLoader},
  layout: 'AppMain',
  data(){
      return {
        loading: false,
        errorMsg: '',
        showPass: false,
          form: {
              name: '',
              email: '',
              password: '',
              confirm_password: ''
          },
      }
  },

  validations() {
    return {
      form: {
        name: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(255)
        },
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
    async register() {
      this.$v.$touch()

      if (this.$v.$invalid) return
      this.loading = true

      try {
        await this.$axios.post('/v1/register', this.form )
        await this.$auth.loginWith( 'laravelSanctum', { data: this.form } )
        await this.$router.push({ path: '/' })

        this.$v.$reset()
      } catch (err) {this.setErrorMsg(err)}

      this.loading = false
    },

    setErrorMsg(err) {
      if (err.response.status === 403) {
        this.errorMsg = err.response.data.error
      } else if (err.response.status === 422) {
        this.errorMsg = err.response.data.errors
      } else {
        this.errorMsg = 'неизвестная ошибка'
      }
      console.log(err.response)
    }
  },

  created() {
    this.$axios.get('/v1/sanctum/csrf-cookie')
  },
}
</script>

<style scoped>

</style>
