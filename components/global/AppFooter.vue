<template>
  <footer>

    <nuxt-link target="_blank" v-if="$auth.user && $auth.user.role" to="/admin"  class="button-admin">
      <i class="fas fa-users-cog"></i>
    </nuxt-link>
    <div class="author-section">
      <div class="container">
        <p>Социальные сети автора:</p>
        <div class="social-icon">
          <a href=""><i class="fab fa-vk"></i></a>
          <a href=""><i class="fab fa-instagram"></i></a>
          <a href=""><i class="fab fa-whatsapp"></i></a>
          <a href=""><i class="fab fa-telegram-plane"></i></a>
        </div>
      </div>
    </div>
    <button id="pagetop" @click="toTop">
      <i class="fas fa-chevron-up"></i>
    </button>
  </footer>
</template>

<script>
    export default {
      name: "AppFooter",

      data() {
        return {
          scTimer: 0,
          scY: 0
        }
      },

      methods: {
        handleScroll: function () {
          if (this.scTimer) return;

          this.scTimer = setTimeout(() => {
            this.scY = window.scrollY;
            clearTimeout(this.scTimer);
            this.scTimer = 0;
          }, 100);
        },

        toTop() {
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        },

        debounce(func, wait) {
          let timeout;
          return () => {
            if (timeout) {
              clearTimeout(timeout);
            }
            timeout = setTimeout(func, wait)
          }
        },
      },

      mounted() {
        window.addEventListener('scroll', this.debounce(this.handleScroll, 200));
      },
    }
</script>

<style>
#pagetop {
  position: fixed;
  color: #8f8f8f;
  font-size: 20px;
  bottom: 50px;
  border-color: #cecece;
  right: 50px;
  border-radius: 50%;
  /* padding: 20px; */
  text-align: center;
  line-height: 14px;
  width: 50px;
  height: 50px;
  cursor: pointer;
}
</style>
