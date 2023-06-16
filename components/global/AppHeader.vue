<template>
  <header>
    <div class="container">
      <div class="header-main">
        <nuxt-link to="/" class="logo">OwnHouse</nuxt-link>
        <div class="search-model">
          <form action="" class="form-search" @submit.prevent>
            <input v-model="search" @focus="toggleClass($event)"
                   @focusout="toggleClass($event, true)"
                   placeholder="Поиск..."
                   type="text">
            <button><i class="fas fa-search"></i></button>
          </form>
          <template v-if="search && list.length">
              <ul>
                <li v-for="item in list">
                  <nuxt-link :to="item.url">{{ item.title }}</nuxt-link>
                </li>
              </ul>
          </template>
        </div>
        <nuxt-link v-if="$auth.loggedIn" to="/account/profile" class="cabinet-auth">
          <img :src="$auth.user.avatar.small" alt="">
          <span>{{ $auth.user.name }}</span>
        </nuxt-link>
        <div v-else class="auth">
          <nuxt-link to="/login">Войти</nuxt-link>
          <nuxt-link to="/register">Зарегистрироваться</nuxt-link>
        </div>
      </div>
      <nav class="navigation">
        <nested-menu/>
      </nav>
    </div>
  </header>
</template>

<script>
    import NestedMenu from "./menu/NestedMenu";
    import { MeiliSearch } from 'meilisearch'
    export default {
      name: "AppHeader",
      components: {NestedMenu},

      data() {
        return {
          search: '',
          list: [],
          meiliSearch: new MeiliSearch({
            host: process.env.MEILISEARCH_HOST,
            apiKey: process.env.MEILISEARCH_KEY,
          })
        }
      },

      watch: {
        async search(val) {
          this.list = (await this.meiliSearch.index('posts').search(val, {limit: 5})).hits
        }
      },

      methods: {
        toggleClass(e, blur = false) {
          if (blur) setTimeout(() => this.search = '', 100)
          e.target.closest('.form-search').classList.toggle('focus-shadow')
        }
      }
    }
</script>

<style>

.header-main {
  gap: 30px;
}

.header-main > * {
  max-width: 185px;
  width: 100%
}

.header-main .search-model {
  max-width: 500px;
  width: 100%;
}

.cabinet-auth {
  display: flex;
  align-items: center;
  justify-content: right;
}

.cabinet-auth span{
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.cabinet-auth img {
  height: 2.1rem;
  box-shadow: 0 3px 6px rgba(0,0,0,.16),0 3px 6px rgba(0,0,0,.23)!important;
  object-fit: cover;
  width: 2.1rem;
  margin-right: 12px;
  border-radius: 50%;
}

.search-model {
  position: relative;
}

.search-model ul {
  position: absolute;
  background: #fff;
  left: 0;
  right: 0;
  top: 40px;
  z-index: 10;
  border-radius: 10px;
}

.search-model ul li {
  padding: 10px;
}

.search-model ul li:hover {
  background: #e4e7e8;
}

.search-model .form-search {
  background: #ecf0f3;
  border-radius: 10px;
  box-shadow: -3px -3px 7px #ffffff, 3px 3px 5px #ceced1;
  min-width: 500px;
  display: flex;
}

.search-model .form-search.focus-shadow {
  box-shadow: inset -3px -3px 7px #ffffff,
  inset 3px 3px 5px #ceced1;
}

.search-model .form-search input {
  border: none;
  background: transparent;
  padding: 7px 15px;
  flex: 1;
}

.search-model .form-search button {
  border: none;
  background: transparent;
  padding: 0 12px;
  font-size: 14px;
}

.header-main {
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navigation {
  padding: 11px 0;
  display: flex;
  /* align-items: center; */
  justify-content: center;
}

.references-menu {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  background: #fff;
  box-shadow: 0 1px 6px rgba(43,42,51,.1);
  max-width: 25rem;
  top: calc(100% + 4px);
  width: max-content;
  z-index: 500;
  transition: all .2s ease;
}

nav li:hover > .references-menu{
  opacity: 1;
  visibility: visible;
}

.references-menu:before {
  content: "";
  display: block;
  height: 8px;
  left: 0;
  position: absolute;
  top: -8px;
  width: 100%;
}

.references-menu.right {
  left: 100%;
  top: 0;
}

.references-menu li a {
  padding: 0.7rem;
  display: block;
  transition: all .2s ease;
  text-decoration: none;
}

.references-menu li a:hover {
  background: #cecece;
}

nav li {
  position: relative;
}

.cursor-pointer {
  cursor: pointer;
}


</style>
