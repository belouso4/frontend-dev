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
      fullHeight: null,
      show: true
    }
  },
  head: {
    title: 'Мой заголовок',
    titleTemplate: '%s - ownhouse Admin',
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
  // head() {
  //     return {
  //
  //
  //         script: [
  //           // {
  //           //   hid: 'stripe',
  //           //   src: 'AdminLTE/plugins/bootstrap/js/bootstrap.bundle.min.js',
  //           //   defer: true,
  //           //   // Changed after script load
  //           // },
  //           // {
  //           //   hid: 'stripe',
  //           //   src: 'AdminLTE/plugins/ekko-lightbox/ekko-lightbox.min.js',
  //           //   defer: true,
  //           //   // Changed after script load
  //           // },
  //           // {
  //           //   hid: 'stripe',
  //           //   src: 'AdminLTE/dist/js/adminlte.min.js',
  //           //   defer: true,
  //           //   // Changed after script load
  //           // },
  //           ],
  //         bodyAttrs: {
  //           // class: this.isMenuOpen ? 'menu-opened' : ''
  //           class: 'sidebar-mini'
  //         }
  //     }
  // },

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
    // console.log('----------',this.$can('view-post'))
    // this.$nextTick(() => {
    //
    //   // this.monitorHeight()
    // })

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
/*@import '~/assets/css/admin-panel-style.css';*/

section.content, section.content-header {
  margin-top: 0
}
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

#__layout > div {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-wrapper {
  flex: 1 0 auto;
  height: 100px;
}

.cursor-pointer {
  cursor: pointer;
}

</style>
<style>
@import "~/assets/css/admin-panel-style.css";
/*.layout-navbar-fixed .main-header {*/
/*  left: 0;*/
/*  position: fixed;*/
/*  right: 0;*/
/*  top: 0;*/
/*  z-index: 1037;*/
/*}*/


/*#__layout .content-wrapper {*/
/*  transition: opacity .3s ease, margin-left .3s ease-in-out;*/
/*}*/

/*#__layout .content-wrapper {*/
/*  transition: opacity .3s ease,*/
/*  margin-left .3s ease-in-out;*/
/*  overflow: auto;*/
/*}*/



.form-group.img {
  padding: 8px 24px;
  border: 1px solid #ced4da;
  height: 300px;
}

.form-group.img img {
  /*height: fit-content;*/
  /*max-height: 128px;*/
  /*object-fit: contain;*/

  height: 100%;
  width: 100%;
  margin: 0 auto;
  object-fit: contain;

}
.content-wrapper section {
  margin: 0;
}

.ql-container{
  min-height: inherit;
}


.form-group label.label-tags {
  position: relative;
}

.form-group label p {
  position: absolute;
  top: -3px;
  right: -14px;
  font-size: 12px;
  color: #999999;
}


.form-group .tags {
  margin-top: 15px;
}

p {
  margin: 0;
}

.ql-editor {
  min-height: 400px;
}

textarea {
  resize: none;
}

</style>
