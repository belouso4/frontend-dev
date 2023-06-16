<template>
  <section class="section-cabinet">
    <div class="container">
      <div class="main-header">
        <h1>{{ getTitle }}</h1>
        <Breadcrumbs/>
      </div>
      <div class="flex-position">
        <aside>
          <div class="aside-title">
            Настройки
          </div>
          <ul class="menu">
            <li>
              <nuxt-link to="/account/profile">Профиль</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/account/liked">Понравившиеся</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/account/viewed">История просмотров</nuxt-link>
            </li>
            <li>
              <nuxt-link to="/account/commented">Комментарии</nuxt-link>
            </li>
            <li>
              <p @click="logout">Выйти</p>
            </li>
          </ul>
        </aside>
        <nuxt-child :title-main.sync="title"></nuxt-child>
      </div>
    </div>
  </section>
</template>

<script>
import {mapMutations} from "vuex";

export default {
  layout: 'AppMain',
  // middleware: ['auth', 'verified'],
  middleware: ['auth', function({ redirect, route }) {
    if(route.path == "/account" || route.path == "/account/"){
      return redirect('/account/profile');
    }
  },],
  data() {
    return {
      title: 'Личный кабинет'
    }
  },

  computed: {
    getTitle() {
      const pages = {
        commented: 'Прокомментированные посты',
        liked: 'Понравившиеся посты',
        profile: 'Личный кабинет',
        viewed: 'История просмотров',
        verify: 'Проверка подтверждении почты',
      }
      const path = this.$route.path.split('/')
      const title = path[path.length - 1]

      return pages[title] ?? 'Личный кабинет'
    }
  },

  methods: {
    async logout(){
        await this.$auth.logout();
    },

    ...mapMutations('breadcrumbs', {
      setBreadcrumbs: 'set',
    }),
  },
}
</script>

<style>
aside li a.nuxt-link-active {
  box-shadow: inset -3px -3px 7px #ffffff, inset 3px 3px 5px #ceced1;
}
.user-avatar {
  position: relative;
  width: 245px;
  height: 245px;
  margin: 0 auto 40px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar img {
  object-fit: cover;
  width: 100%;
}

.user-avatar .overlay-avatar {
  display: none;
  position: absolute;
  align-items: center;
  justify-content: center;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: transparent;
  color: #fff;
  font-size: 30px;
  cursor: pointer;
  transition: all .7s ease;
}

.user-avatar:hover .overlay-avatar{
  display: flex;
  background: rgb(0 0 0 / 36%);
  transition: all .7s ease;
}

.form-group {
  width: 400px;
  margin: 0 auto;
}

.form-group:not(:last-child) {
 margin-bottom: 20px;
}

.form-group input {
  width: 100%;
  padding: 7px;
  margin-top: 5px;
}

.form-group button {
  display: block;
  margin-left: auto;
  padding: 7px;
  cursor: pointer;
}
</style>
