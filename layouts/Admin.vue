<template>

    <div v-if="getReloadStatus">
      <NavBar/>
      <SideBar/>

      <div class="content-wrapper iframe-mode">
        <NavigationTabs/>
        <nuxt />
      </div>

      <Footer/>
      <div @click="overlay()" id="sidebar-overlay"></div>
      <search-modal/>
      <toaster/>
    </div>
    <div v-else class="blink-1"><i class="fas fa-cogs"></i></div>

</template>

<script>
import NavBar from "../components/admin/global/NavBar";
import SideBar from "../components/admin/global/SideBar";
import Footer from "../components/admin/global/Footer";
import SearchModal from "../components/admin/global/SearchModal";
import Toaster from "../components/admin/ui/Toaster";

import { mapGetters } from "vuex";
import NavigationTabs from "../components/admin/global/NavigationTabs";

export default {
  name: "Admin",
  middleware: ['admin'],

  components: {
    NavigationTabs,
    NavBar,SideBar,Footer,SearchModal,Toaster
  },

  data() {
    return {
      isStripeLoaded: false,
      fullHeight: '',
      show: true
    }
  },

  head: {
    title: 'own-house',
    titleTemplate: '%s - OwnHouse Admin',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Home page description',
      },
    ],
    link: [
      // { rel:"stylesheet", type:"text/css", href: require('~/assets/css/admin-panel-style.css') },
      { rel:"stylesheet", type:"text/css", href: '/AdminLTE/css/toastr.min.css' },
      { rel:"stylesheet", type:"text/css", href: '/AdminLTE/css/adminlte.min.css' },
      { rel:"stylesheet", type:"text/css", href:'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback' },
    ],
    bodyAttrs: {
      // class: this.isMenuOpen ? 'menu-opened' : ''
      class: 'sidebar-mini overflow-hidden'
    }

  },

  methods: {
    // whenever the document is resized, re-set the 'fullHeight' variable
    handleResize (event) {
      this.fullHeight = document.documentElement.clientHeight
    },
    overlay() {
      let body = document.querySelector('body')

      body.classList.remove('sidebar-open')
      body.classList.add('sidebar-collapse')
      body.classList.add('sidebar-closed')
    },
  },

  computed: {
    ...mapGetters({
      getReloadStatus: 'ui/getReloadStatus'
    }),

    key() {
      return this.$route.path + Math.random()
    },
  },

  created() {
    setTimeout(() => {
      this.$store.commit('ui/toggleReload', true)
    }, 500)
  },

  destroyed() {
    this.$store.commit('ui/toggleReload', false)
  },

  updated() {
    let body = document.querySelector('body')

    if (window.innerWidth < 991) {
      body.classList.add('sidebar-closed')
      body.classList.add('sidebar-collapse')
    }
  },

  mounted() {
    this.fullHeight = window.innerWidth
    let body = document.querySelector('body')
    if (window.innerWidth < 991) {
      body.classList.add('sidebar-closed')
      body.classList.add('sidebar-collapse')
    }

    window.addEventListener('resize', () => {

      let body = document.querySelector('body')
      if (window.innerWidth < 991 && this.$nuxt.$data.layoutName === 'Admin') {
        if (body.classList.contains('sidebar-open')) {

        } else {

          body.classList.add('sidebar-closed')
          body.classList.add('sidebar-collapse')
        }

      } else {
        body.classList.remove('sidebar-closed')
        body.classList.remove('sidebar-collapse')
        body.classList.remove('sidebar-open')

      }
    })
  },

  beforeDestroy() {
    let body = document.querySelector('body')
    body.classList.remove()
    window.removeEventListener('resize', () => {
      body.classList.remove()
    })
  },


}
</script>

<style scoped>
.blink-1 {
  animation-name: blink;
  animation-timing-function: linear;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  color: #686868;
  font-size: 70px;
  min-width: 100vh;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

</style>

<style>
@import "~/assets/css/admin-panel-style.css";
</style>
