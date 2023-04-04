<template>
  <section class="section-cabinet">
    <div class="container">
      <div class="main-header">
        <h1> Личный кабинет | verify_url</h1>
        <Breadcrumbs/>
      </div>
      <div class="flex-position">
        <aside>
          <div class="aside-title">
            Настройки
          </div>
          <ul class="menu">
            <li>
              <a>Профиль</a>
            </li>
            <li>
              <a>Рекомендации</a>
            </li>
            <li>
              <a>Настройки</a>
            </li>
            <li>
              <p @click="logout">Выйти</p>
            </li>
          </ul>
        </aside>
        <div class="right-content">
          <div v-show="verifyingEmail" class="w-1/2 flex flex-col items-center">
            <i class="fas fa-2x fa-sync fa-spin"></i>
          </div>
          <div v-show="!verifyingEmail" class="w-1/2">
            <div v-if="$auth.user.email_verified_at != null" class="flex flex-col items-center">
              <div class="text-secondaryBlack text-xl font-sans-lato font-bold text-center">
                Вы готовы идти! Ваша электронная почта подтверждена!
              </div>
              <img src="/img/ui/verified-account.svg" class="w-25 h-25 my-5 pointer-events-none"/>
              <nuxt-link to="/search" class="cursor-pointer text-center rounded bg-primaryGreen font-sans-montserrat py-3 px-8 text-white text-base uppercase">
                Find coffee
              </nuxt-link>
            </div>
            <div v-if="$auth.user.email_verified_at == null" class="flex flex-col items-center">
              <div class="text-secondaryBlack text-xl font-sans-lato font-bold text-center">Вы не подтвердили свой адрес электронной почты.</div>
              <img class="my-4 pointer-events-none" src="/img/ui/non-verified-account.svg"/>

              <a v-on:click="resendVerificationEmail()" class="">
                Выслать повторно письмо для подтверждения
              </a>
              <span class="text-alertRed font-sans-lato" v-show="emailResent">
                Пожалуйста, проверьте свою электронную почту на наличие ссылки для подтверждения
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  </section>
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
      verifyingEmail: false
    }
  },

  computed: {

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
  },
}
</script>

<style scoped>

</style>
