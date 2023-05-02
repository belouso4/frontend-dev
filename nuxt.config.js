require('dotenv').config()
import getSiteMeta from "./utils/getSiteMeta";

const meta = getSiteMeta();

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  // mode: 'universal',
  server: {
    host: process.env.NUXT_HOST,
    port: process.env.NUXT_PORT
  },
  // server: {
  //   host: "0.0.0.0",
  //   port: '3000'
  // },

  ssr: true,
  head: {
    title: 'frontend',
    htmlAttrs: {
      lang: 'ru'
    },
    meta: [
      ...meta,
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { hid: 'keywords', name: 'keywords', content: 'own-house, ownHouse, ownhouse' },
      { property: "og:image:width", content: "740" },
      { property: "og:image:height", content: "300" },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel:"stylesheet", type:"text/css", href:'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css' },
    ]
  },

  // prismic: {
  //   apiOptions: {
  //     routes: [
  //       {
  //         type: 'page',
  //         path: '/:category/post/:slug',
  //         resolvers: {
  //           // A list of "path variables" mapped to the API ID
  //           // of a Content Relationship field in the Custom Type.
  //           category: 'category',
  //           section: 'category.section',
  //         },
  //       },
  //     ],
  //   },
  // },

  router: {
    // routes: [
    //   {
    //     path: '/:category',
    //     component: 'pages/_category/post/index.vue',
    //     children: {
    //       path: '/post/:slug',
    //       component: 'pages/_category/post/_slug.vue',
    //       // children: {
    //       //   path: '/:slug',
    //       //   component: 'pages/_category/post/_slug.vue',
    //       // }
    //     }
    //   }
    // ],
    extendRoutes(routes, resolve) {
      // console.log(routes)
      // routes.push({
      //   path: '/:category/post/:slug',
      //   component: 'pages/_category/post/_slug.vue',
      //   // components: {
      //   //   default: resolve(__dirname, 'pages/_category/post/_slug.vue'), // or routes[index].component
      //   // },
      //   // chunkNames: {
      //   //   modal: 'components/modal'
      //   // }
      // })
    }
  },

  publicRuntimeConfig: {
    API_URL_IMG: process.env.API_BASE_URL_IMG || 'http://localhost:8000'
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
    '~/plugins/vuelidate.js',
    '~/plugins/toaster.js',
    '~/plugins/ownhouseAPI.js',
    '~/plugins/axios.js',
    '~/plugins/mixins/validation.js',
    '~/plugins/pagination.js',
    '~/plugins/route',
    { src: '~/plugins/vue-infinite-loading.js', ssr: false},
    { src: '~/plugins/vue-tags-input.js', ssr: false },
    {src:'~/plugins/vue-quill-editor.js',ssr: false},
  ],

  axios: {
    baseURL: process.env.API_BASE_URL,
    credentials: true
  },

  loading: false,

  auth: {
    redirect: {
      login: '/login',
      home: false
    },
    plugins: ['~/plugins/can.js'],
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

  serverMiddleware: [{
    path: '/admin',
    handler: '~/server-middleware/swith-spa.js'
  }],
  // serverMiddleware: ['~/server-middleware/swith-spa.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [

  ],

  render: {
    fallback: false
  },

  // router: {
  //   linkExactActiveClass: 'active',
  //   extendRoutes(routes, resolve) {
  //     routes.push({
  //       name: "custom",
  //       path: "/admin/:pkg(.*)",
  //       component: resolve(__dirname, "pages/admin/404k.vue"),
  //     });
  //   },
  // },

  // hooks: {
  //   render: {
  //     errorMiddleware(app) {
  //       app.use((error, _req, _res, next) => {
  //         if (error) {
  //           console.log("Logged in errorMiddleware", error);
  //         }
  //
  //         next(error);
  //       });
  //     },
  //   },
  // },


  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      // envName: server, client, modern
      presets() {
        return [
          [
            '@nuxt/babel-preset-app',
            {
              useBuiltIns: "entry"
            }
          ]
        ]
      },
    },
    transpile: [
      'defu',
    ],
    splitChunks: {
      layouts: true
    }
  }
}
