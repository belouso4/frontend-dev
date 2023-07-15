<template>
  <section class="main-section auth-section">
    <div class="container">
      <form action="" class="form-auth" @submit.prevent="forgotPassword()">
        <h1>Авторизация</h1>
        <p v-if="msg">{{ msg }}</p>
        <form-group :validator="$v.form.email" label="Email">
          <input v-model="form.email" type="text" placeholder="Введите email">
        </form-group>
        <div class="form-auth_footer d-flex">
          <button-loader :loading="loading">Сбросить пароль</button-loader>
        </div>

      </form>
    </div>
  </section>
</template>

<script>
import {email, maxLength, required} from "vuelidate/lib/validators";
import ButtonLoader from "../components/Ui/ButtonLoader.vue";

export default {
  middleware: 'guest',
  layout: 'AppMain',
  components: {ButtonLoader},
  data(){
    return {
      msg: null,
      loading: false,
      form: {
        email: '',
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
      }
    }
  },

  methods: {
    async forgotPassword() {
      this.$v.$touch()
      if (this.$v.$invalid) return
      this.loading = true

      try {
        this.msg = (await this.$axios.post('/v1/forgot-password', {
          email: this.form.email
        })).data

        this.$v.$reset()
        this.$toaster.success('Данные успешно сохраннены!')
      } catch (err) {console.log(err)}

      this.loading = false
    },
  }
}
</script>

<style>

</style>
