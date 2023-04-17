<template>
  <header>
    <div class="container">
      <nav class="navigation">
        <nuxt-link to="/" class="logo">OwnHouse</nuxt-link>
<!--        <ul>-->
<!--          <li>-->
<!--            <nuxt-link to="/posts">Посты</nuxt-link>-->
<!--          </li>-->
<!--          <li>-->
<!--            <nuxt-link to="/posts">Категории</nuxt-link>-->
<!--          </li>-->
<!--          <li>-->
<!--            &ndash;&gt;-->
<!--          </li>-->
<!--          <li>-->
<!--            <nuxt-link to="/posts">Смартфоны</nuxt-link>-->
<!--          </li>-->
<!--          <li>-->
<!--            <nuxt-link to="/posts">Бытовая техника</nuxt-link>-->
<!--          </li>-->
<!--          <li>-->
<!--            <nuxt-link to="/posts">ИИ</nuxt-link>-->
<!--          </li>-->
<!--        </ul>-->
        <nested-menu/>
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
    import NestedMenu from "./menu/NestedMenu";
    export default {
      name: "AppHeader",
      components: {NestedMenu},
    }

</script>

<style>

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
