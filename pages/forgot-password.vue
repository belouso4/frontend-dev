<template>
  <section class="main-section auth-section">
    <div class="container">
      <form action="" class="form-auth" @submit.prevent="forgotPassword()">
        <h1>Авторизация</h1>
        <label for="">
          Email
          <input id="login-email" v-model="form.email" type="text" placeholder="Введите email">
        </label>
        <div class="form-auth_footer d-flex">
          <button>Отправить инструкции по сбросу</button>
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
        email: 'rdthrdjjft@mail.ru',
      },
    }
  },

  methods: {
    async forgotPassword() {
      await this.$axios.post('/v1/forgot-password', {
        email: this.form.email
      }).then(res => console.log(res))
    },

  }
}
</script>

<style>

</style>
