<template>
  <div class="right-content verify">
    <div v-if="verifyingEmail" class="w-1/2 flex flex-col items-center skeleton-verify">
      <span class="skeleton"></span>
      <div class="skeleton"></div>
      <span class="skeleton"></span>
    </div>
    <div v-else class="w-1/2">
      <div v-if="$auth.user.email_verified_at != null" class="flex flex-col items-center">
        <div class="text-secondaryBlack text-xl font-sans-lato font-bold text-center">
          <h3>Ваша электронная почта подтверждена!</h3>
        </div>
        <img src="/img/ui/verified-account.svg"/>
        <nuxt-link to="/search" class="cursor-pointer text-center rounded bg-primaryGreen font-sans-montserrat py-3 px-8 text-white text-base uppercase">
          Перейти на главную страницу
        </nuxt-link>
      </div>
      <div v-if="$auth.user.email_verified_at == null" class="flex flex-col items-center">
        <div class="text-secondaryBlack text-xl font-sans-lato font-bold text-center">
          <h3>Вы не подтвердили свой адрес электронной почты.</h3>
        </div>
        <img class="my-4 pointer-events-none" src="/img/ui/non-verified-account.svg"/>

        <a v-on:click="resendVerificationEmail()" class="cursor-pointer">
          Выслать повторно письмо для подтверждения
        </a>
        <span class="text-alertRed font-sans-lato" v-show="emailResent">
                Пожалуйста, проверьте свою электронную почту на наличие ссылки для подтверждения
        </span>
      </div>
    </div>

  </div>
</template>

<script>
import zxcvbn from 'zxcvbn'
import {mapMutations} from "vuex";

export default {
  layout: 'AppMain',
  middleware: ['auth'],
  data(){
    return {
      message: '',
      emailResent: false,
      verifyingEmail: true
    }
  },

  methods: {
    async verifyEmail() {
      this.verifyingEmail = true;

      try {
        this.message = await this.$axios.post(this.$route.query.verify_url)
      } catch (err) {this.verifyingEmail = false}

      this.reloadUser();
    },

    async resendVerificationEmail(){
      await this.$axios.post('/v1/email/resend');
      this.emailResent = true;
    },

    async reloadUser(){
      await this.$auth.fetchUser();
      this.verifyingEmail = false;
    },

    async logout(){
      await this.$auth.logout();
    },

    ...mapMutations('breadcrumbs', {
      setBreadcrumbs: 'set',
    }),
  },

  created() {
    this.setBreadcrumbs([
      { text: 'Главная', to: { path: '/' }},
      { text: 'Личны кабинет', to: { path: '/account' }},
      { text: 'verify' } // placeholder
    ]);
  },

  mounted(){
    if( this.$route.query.verify_url ){
      this.verifyEmail();
    }
    this.verifyingEmail = false;
  },
}
</script>

<style scoped>

.verify > div:last-child span {
  display: block;
  margin-top: 20px;
  font-weight: bold;
}

</style>
