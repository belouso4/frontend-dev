<template>
  <header>
    <div class="container">
      <nav class="navigation">
        <nuxt-link to="/" class="logo">OwnHouse</nuxt-link>
        <ul>
          <li>
            <nuxt-link to="/posts">Посты</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/posts">Категории</nuxt-link>
          </li>
          <li>
            -->
          </li>
          <li>
            <nuxt-link to="/posts">Смартфоны</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/posts">Бытовая техника</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/posts">ИИ</nuxt-link>
          </li>
        </ul>
        <nuxt-link v-if="$auth.loggedIn" to="/account" class="cabinet-auth">Личный кабинет</nuxt-link>
        <div v-else class="auth">
          <nuxt-link to="/login">Войти</nuxt-link>
          <nuxt-link to="/register">Зарегистрироваться</nuxt-link>
        </div>

      </nav>
    </div>
  </header>
</template>

<script>
    export default {
        name: "AppHeader"
    }
</script>

<style scoped>

</style>
