require('dotenv').config()

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  // mode: 'universal',
  server: {
    host: process.env.NUXT_HOST,
    port: process.env.NUXT_PORT,
  },
  ssr: true,
  head: {
    title: 'frontend',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel:"stylesheet", type:"text/css", href:'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css' },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/config.css',
    '@/assets/css/style.css',

  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/dotenv',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/components.js',
    '~/plugins/ownhouseAPI.js',
    '~/plugins/axios.js',
    '~/plugins/mixins/validation.js',
    '~/plugins/pagination.js',
    '~/plugins/can.js',
    { src: '~/plugins/vue-infinite-loading.js', ssr: false},
    { src: '~/plugins/vue-tags-input.js', ssr: false },
    {src:'~/plugins/vue-quill-editor.js',ssr: false},
  ],

  axios: {
    baseURL: process.env.API_BASE_URL,
    credentials: true
  },

  auth: {
    redirect: {
      login: '/?login=true',
      home: false
    },
    strategies: {
      // 'local': {
      //   user: {
      //     property: false
      //   },
      //   token: {
      //     property: 'token'
      //   },
      //   endpoints: {
      //     login: {
      //       url: '/v1/login',
      //       method: 'post',
      //       withCredentials: true,
      //       headers: {
      //         'Content-Type': 'application/json'
      //       },
      //     },
      //     logout: {
      //       url: '/v1/logout',
      //       method: 'post',
      //     },
      //     user: {
      //       url: '/v1/user',
      //       method: 'get'
      //     },
      //   },
      // },
      // 'laravelSanctum': {
      //   provider: 'laravel/sanctum',
      //   url: process.env.API_BASE_URL,
      //   endpoints: {
      //     login: {
      //       url: '/login'
      //     },
      //     user: {
      //       url: '/v1/user'
      //     },
      //     logout: {
      //       url: '/v1/logout'
      //     }
      //   }
      // }
      'laravelSanctum': {
        provider: 'laravel/sanctum',
        url: process.env.API_BASE_URL + '/v1',
        endpoints: {
          login: {
            url: '/login'
          },
          user: {
            url: '/user'
          },
          logout: {
            url: '/logout'
          }
        }
      }
    }
  },

  serverMiddleware: ['~/server-middleware/swith-spa.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [

  ],

  render: {
    fallback: false
  },

  router: {
    linkExactActiveClass: 'active',
    extendRoutes(routes, resolve) {
      routes.push({
        name: "custom",
        path: "/admin/:pkg(.*)",
        component: resolve(__dirname, "pages/admin/404.vue"),
      });
    },
  },

  hooks: {
    render: {
      errorMiddleware(app) {
        app.use((error, _req, _res, next) => {
          if (error) {
            console.log("Logged in errorMiddleware", error);
          }
          next(error);
        });
      },
    },
  },


  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      'defu',
    ],
    splitChunks: {
      layouts: true
    }
  }
}
